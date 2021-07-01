/* Routine */
function deleteByKey (arData, keyToRemove) {
	for(key in arData){
	  if(arData.hasOwnProperty(key) && (key == keyToRemove)) {
	    delete arData[key];
	  }
	}
	
	return arData;
}

function arrayLength (arData) {
	var result = 0;
	for(key in arData) result++;
	
	return result;
}

function nullifyDate(date)
{
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);

	return date;
};

function cloneDebug (arData) {
	var arTmp = JSON.stringify(arData);
	return JSON.parse(arTmp);
}

// our application constructor
function application () {
	this.currentUser = 0;
	this.arInstallRatingUsers = {};
	
	// get daily date period	
	this.today = nullifyDate(new Date()),
	this.yesterday = new Date(this.today);
	this.yesterday.setDate(this.yesterday.getDate() - 1);

	this.today = tempus(this.today).format('%Y-%m-%d');	
	this.yesterday = tempus(this.yesterday).format('%Y-%m-%d');	
	
    this.appLoadedKeys = [];
}

/* installation methods */
application.prototype.addRatingUserRow = function (arUser) {
	$('#users').append('<li data-user-id="' + arUser.id +'"><a href="javascript:void(0);" onclick="app.removeRatingUser(' + arUser.id + 
		');" class="btn btn-danger btn-raised"><i class="fa fa-times"></i><div class="ripple-wrapper"></div></a> ' +
		arUser.name + '</li>');
}

application.prototype.removeRatingUser = function (idUser) {
	result = confirm('Вы уверены, что хотите удалить пользователя ' + this.arInstallRatingUsers[idUser].name 
	  + ' из рейтинга?');
	if (result) {
		$('[data-user-id=' + idUser + ']').remove();
		this.arInstallRatingUsers = deleteByKey(this.arInstallRatingUsers, idUser);
		app.checkSaving();
		// console.log(this.arInstallRatingUsers);
	}
}

application.prototype.addRatingUsers = function() {
	var curapp = this;

	BX24.selectUsers(function(users) {
		for (var indexUser in users) {
			if (!curapp.arInstallRatingUsers.hasOwnProperty(users[indexUser].id)) {
				curapp.arInstallRatingUsers[users[indexUser].id] = users[indexUser];
				curapp.addRatingUserRow(users[indexUser]);
			}
		}
		curapp.checkSaving();
	});
}

application.prototype.checkSaving = function () {
	if (arrayLength(this.arInstallRatingUsers) > 0) {
		$('#save-btn').removeClass('disabled');
		$('#users').removeClass('hidden');
		app.resizeFrame();
		
	}
	else {
		$('#save-btn').addClass('disabled');
		$('#users').addClass('hidden');
	}
}

application.prototype.prepareEntity = function (arEntityDesc) {
	var batch = [];
	
	batch.push(['entity.add', {'ENTITY': arEntityDesc.NAME, 'NAME': arEntityDesc.DESC, 'ACCESS': {AU: 'W'}}]);
	batch.push(['entity.update', {'ENTITY': arEntityDesc.NAME, 'ACCESS': {AU: 'W'}}]);
	
	for (indexProperty in arEntityDesc.PROPERTIES) 
		batch.push(['entity.item.property.add', {
			ENTITY: arEntityDesc.NAME, 
			PROPERTY: arEntityDesc.PROPERTIES[indexProperty].CODE, 
			NAME: arEntityDesc.PROPERTIES[indexProperty].NAME, 
			TYPE: arEntityDesc.PROPERTIES[indexProperty].TYPE
		}]);

	return batch;		
}

application.prototype.finishInstallation = function () {
	
	// start saving
	$('#save-btn').find('i').removeClass('fa-check').addClass('fa-spinner').addClass('fa-spin');
	
	// define storages
	var arRatingUsersEntity = {
		NAME: 'users',
		DESC: 'Rating users',
		PROPERTIES: [
			{CODE: 'ID_USER', NAME: 'User ID', TYPE: 'N'}
		]
	},
	
	arRatingDataEntity = {
		NAME: 'ratings',
		DESC: 'Rating data',
		PROPERTIES: [
			{CODE: 'ID_USER', NAME: 'User ID', TYPE: 'N'},
			{CODE: 'SUM', NAME: 'Daily sum', TYPE: 'N'},
			{CODE: 'RATE_DATE', NAME: 'Rating Date', TYPE: 'S'}
		]
	};
	
	var arEntityBatch = this.prepareEntity(arRatingUsersEntity);
	arEntityBatch = arEntityBatch.concat(this.prepareEntity(arRatingDataEntity));
	
	for (user in this.arInstallRatingUsers) 
		arEntityBatch.push(['entity.item.add', {
			ENTITY: 'users', 
			DATE_ACTIVE_FROM: new Date(), 
			NAME: this.arInstallRatingUsers[user].name,
			PROPERTY_VALUES: {
				ID_USER: this.arInstallRatingUsers[user].id
			}
		}]);
	
	var curapp = this;
	
	
	// Create storage and add rating users
	BX24.callBatch(arEntityBatch, 
	
		function (result) {
		
			// check saving of rating users
			BX24.callMethod('entity.item.get', {
				ENTITY: 'users',
				SORT: {DATE_ACTIVE_FROM: 'ASC'}
				}, 
				
				function (result) {
				
					if (result.error()) {
						curapp.displayErrorMessage('К сожалению, произошла ошибка сохранения пользователей рейтинга. Попробуйте переустановить приложение',
							['#users']);
						console.error(result.error());
					}
					else
					{
						// ok, go to our application
						BX24.installFinish();
					}
				
				}
			);
	});	
	
}

/* common methods */
application.prototype.resizeFrame = function () {

	var currentSize = BX24.getScrollSize();
	minHeight = currentSize.scrollHeight;
	
	if (minHeight < 400) minHeight = 400;
	BX24.resizeWindow(this.FrameWidth, minHeight);

}

application.prototype.saveFrameWidth = function () {
	this.FrameWidth = document.getElementById("app").offsetWidth;
}
		
application.prototype.displayErrorMessage = function(message, arSelectors) {
	for (selector in arSelectors) {
		$(selector).html(message);
		$(selector).removeClass('hidden');
	}
}

application.prototype.displayCurrentUser = function(selector) {
	var currapp = this;
	
	BX24.callMethod('user.current', {}, function(result){
		currapp.currentUser = result.data().ID;
		$(selector).html(result.data().NAME + ' ' + result.data().LAST_NAME);
	});
}

application.prototype.isDataLoaded = function() {

    for (keyIndex in this.appLoadedKeys)
        if (this.appLoadedKeys[keyIndex].loaded !== true) return;

    this.processUserInterface();
}

// Добавляем новый ключ в список проверки загружаемых данных
application.prototype.addLoadedKey = function(aKey) {
    this.appLoadedKeys[aKey] = {
        loaded: false
    };
}
		
/* application methods */
application.prototype.getUserBlockHTML = function (idUser) {
	
	var itemHTML = '<div class="list-group-item">' +
		'<div class="row-picture">' +
			'<img class="circle" src="' + this.arInstallRatingUsers[idUser].PERSONAL_PHOTO + '" alt="icon">' +
		'</div>' +
		'<div class="row-content">' +
			'<div class="action-secondary"><i class="mdi-material-info"></i></div>' +
			'<span class="list-group-item-heading">' + 
				this.arInstallRatingUsers[idUser].FIRST_NAME + ' ' +
				this.arInstallRatingUsers[idUser].LAST_NAME + 
				
				'</span>' +
			'<p class="list-group-item-text text-success">' +
				accounting.formatNumber(this.arInstallRatingUsers[idUser].SUM, 0, ' ') + '</p>' +
		'</div>' +
	'</div>';
	
	return itemHTML;

}

application.prototype.processUserInterface = function () {

	function compareUsers(userA, userB) {
		  return userB.SUM - userA.SUM;
	}
	
	var arSortedRatingUsers = [];
	for (idUser in this.arInstallRatingUsers)
		arSortedRatingUsers.push(this.arInstallRatingUsers[idUser]);
		
	arSortedRatingUsers.sort(compareUsers);

	console.log('Все данные ', this.arInstallRatingUsers);			
	console.log('Отсортированные данные ', arSortedRatingUsers);			
	
	$('#rating-list').html('');
	
	
	var my_sum = 0, max_sum = 0;
	if (this.arInstallRatingUsers.hasOwnProperty(this.currentUser))
		my_sum = this.arInstallRatingUsers[this.currentUser].SUM;
	
	for (indexUser in arSortedRatingUsers) {
		idUser = arSortedRatingUsers[indexUser].ID_USER;
		userHTML = this.getUserBlockHTML(idUser);

		if (max_sum < this.arInstallRatingUsers[idUser].SUM)
			max_sum = this.arInstallRatingUsers[idUser].SUM;
			
		$('#rating-list').append(userHTML);
	}
	
	var additionalHTML = 
		'<div class="list-group-item">' +
			'<div class="row-action-primary"><i class="fa fa-usd"></i></div>' +
			'<div class="row-content text-success">' +
				'<div class="action-secondary"><i class="mdi-material-info"></i></div>' +
				'<span class="list-group-item-heading">' + accounting.formatNumber(my_sum, 0, ' ') + '</span>' +
			'</div>' +
		'</div>	';	
		
	$('#rating-list-real').html(additionalHTML);
	
	if (my_sum < max_sum) {
		var additionalHTML = 
			'<div class="list-group-item">' +
				'<div class="row-action-primary"><i class="fa fa-arrow-up"></i></div>' +
				'<div class="row-content text-danger">' +
					'<div class="action-secondary"><i class="mdi-material-info"></i></div>' +
					'<span class="list-group-item-heading">' + (max_sum - my_sum) + '</span>' +
					'<p class="list-group-item-text text-danger">осталось до лидера</p>' +
				'</div>' +
			'</div>	';	
			
		$('#rating-list-real').append(additionalHTML);
	}
	
	
}

application.prototype.SaveRatingData = function () {
	
	var curapp = this,
		arFields = {
			ENTITY: 'ratings',
			DATE_ACTIVE_FROM: new Date(),
			NAME: this.arInstallRatingUsers[this.currentUser].NAME,
			PROPERTY_VALUES: {
				ID_USER: this.currentUser,
				SUM: this.arInstallRatingUsers[this.currentUser].SUM,
				RATE_DATE: this.yesterday
			}
		},
		rest_command = 'entity.item.add';
	
	if (this.idRating != 0) {
		arFields.ID = this.idRating;
		rest_command = 'entity.item.update';
	}
	
	BX24.callMethod(rest_command, arFields, 
		
		function (result) {
		
			if (result.error()) {
				curapp.displayErrorMessage('К сожалению, произошла ошибка сохранения данных рейтинга. Попробуйте перезапустить приложение',
					['#error']);
				console.error(result.error());
			}
			else
			{
				console.log('Сохранены данные о сделках текущего пользователя');
				console.log('step 5 after ', cloneDebug(curapp.arInstallRatingUsers));
			}
		}
	);
}

application.prototype.GetCurrentUserDeals = function () {
	var curapp = this;

	BX24.callMethod(
		"crm.deal.list", 
		{ 
			order: { "DATE_CREATE": "ASC" },
			filter: { 
				"ASSIGNED_BY_ID": this.currentUser, 
				"CLOSED": 'Y' /*,
				">=DATE_MODIFY": yesterday,
				"<DATE_MODIFY": today */
				},
			select: [ "ID", "TITLE", "OPPORTUNITY", "ASSIGNED_BY_ID"]
		}, 
		function(result) 
		{
			if (result.error()) {
				curapp.displayErrorMessage('К сожалению, произошла ошибка получения ваших сделок. Попробуйте повторить отчет позже',
					['#error']);
				console.error(result.error());
			}
			else
			{
				var data = result.data();
				console.log('step 4', data);
				
				
				curapp.arInstallRatingUsers[curapp.currentUser].SUM = 0;
				for (indexDeal in data)
					curapp.arInstallRatingUsers[curapp.currentUser].SUM += parseFloat(data[indexDeal].OPPORTUNITY);
							
				if (result.more())
					result.next();
				else {
					console.log('Получены данные о сделках текущего пользователя');
					
					console.log('step 4 after ', cloneDebug(curapp.arInstallRatingUsers));
					
					curapp.appLoadedKeys['user-deals'].loaded = true;
					curapp.isDataLoaded();
					
					curapp.SaveRatingData();					
				}
					
			}
		}
	);	
}
	
application.prototype.GetUserRatingData = function (arIdsUser) {

	this.idRating = 0;
	
	var curapp = this;
	
	var arRatingFilter = {
		'PROPERTY_ID_USER': arIdsUser,
		'PROPERTY_RATE_DATE': this.yesterday
	}
						
	BX24.callMethod('entity.item.get', {
			ENTITY: 'ratings',
			SORT: {DATE_ACTIVE_FROM: 'ASC'},
			FILTER: arRatingFilter
		}, 
		
		function (result) {
		
			if (result.error()) {
				curapp.displayErrorMessage('К сожалению, произошла ошибка получения данных рейтинга. Попробуйте переустановить приложение',
					['#error']);
				console.error(result.error());
			}
			else
			{
				var data = result.data();
				console.log('step 3', data);


				for (indexRatingUser in data) {
					idUser = data[indexRatingUser].PROPERTY_VALUES.ID_USER;

					if (curapp.currentUser == idUser) 
						curapp.idRating = data[indexRatingUser].ID;
					else					
						curapp.arInstallRatingUsers[idUser].SUM = data[indexRatingUser].PROPERTY_VALUES.SUM;
						
					curapp.arInstallRatingUsers[idUser].RATE_DATE = data[indexRatingUser].PROPERTY_VALUES.RATE_DATE;
					curapp.arInstallRatingUsers[idUser].ID_RATING_ITEM = data[indexRatingUser].ID;
				}
				
				console.log('Получена информация сохраненного рейтинга пользователей');
				
				console.log('step 3 after ', cloneDebug(curapp.arInstallRatingUsers));
			
				curapp.appLoadedKeys['rating-data'].loaded = true;
				curapp.isDataLoaded();
					
			}
		
		}
	);
}

application.prototype.GetUserData = function (arIdsUser) {
	var curapp = this;
	
	BX24.callMethod(
		'user.get', 
		{"ID": arIdsUser}, 
		function (result) {
		
			var data = result.data();
				console.log('step 2', data);
			
			
			for (userIndex in data) {
			
				idUser = data[userIndex].ID;
				curapp.arInstallRatingUsers[idUser].FIRST_NAME = data[userIndex].NAME;
				curapp.arInstallRatingUsers[idUser].LAST_NAME = data[userIndex].LAST_NAME;
				curapp.arInstallRatingUsers[idUser].MIDDLE_NAME = data[userIndex].SECOND_NAME;
				curapp.arInstallRatingUsers[idUser].PERSONAL_PHOTO = data[userIndex].PERSONAL_PHOTO;
				
			}
			
			if (result.more())
				result.next();
			else {
				console.log('Получена информация пользователей');
				
				console.log('step 2 after ', cloneDebug(curapp.arInstallRatingUsers));
				
				curapp.appLoadedKeys['user-data'].loaded = true;
				curapp.isDataLoaded();
					
			}

		}
	);
}

application.prototype.GetRatingUsers = function () {
	var curapp = this;
	this.arInstallRatingUsers = new Object();
	console.log('step 1 before ', curapp.arInstallRatingUsers);
	
	BX24.callMethod('entity.item.get', {
		ENTITY: 'users',
		SORT: {DATE_ACTIVE_FROM: 'ASC'}
		}, 
		
		function (result) {
		
			if (result.error()) {
				curapp.displayErrorMessage('К сожалению, произошла ошибка получения пользователей рейтинга. Попробуйте переустановить приложение',
					['#error']);
				console.error(result.error());
			}
			else
			{
				var data = result.data();
				console.log('step 1', data);

				// prepare array	
				var arIdsUser = [];
				for (indexUser in data) {
					idUser = data[indexUser].PROPERTY_VALUES.ID_USER;
					arIdsUser.push(idUser);
					curapp.arInstallRatingUsers[idUser] = {};
					curapp.arInstallRatingUsers[idUser].NAME = data[indexUser].NAME;
					curapp.arInstallRatingUsers[idUser].ID_USER = data[indexUser].PROPERTY_VALUES.ID_USER;
				}
				
				//debug ('step 1 after ', curapp.arInstallRatingUsers, 1);
				
				if (result.more())
					result.next();
				else {
					
					console.log('step 1 after ', cloneDebug(curapp.arInstallRatingUsers));
					
					curapp.appLoadedKeys['user-list'].loaded = true;
					
					curapp.GetUserData(arIdsUser);
					curapp.GetCurrentUserDeals();
					curapp.GetUserRatingData(arIdsUser);	
				}
					
			}
		
		}
	);		
}

application.prototype.displayDeals = function () {
		
	var curapp = this;
	
	this.addLoadedKey('current-user');
	this.addLoadedKey('user-list');
	this.addLoadedKey('user-data');
	this.addLoadedKey('rating-data');
	this.addLoadedKey('user-deals');
	
	BX24.callMethod('user.current', {}, function(result){
		curapp.currentUser = result.data().ID;
		curapp.appLoadedKeys['current-user'].loaded = true;
		curapp.isDataLoaded();
	});
	
	this.GetRatingUsers();
	
}

// create our application
app = new application();