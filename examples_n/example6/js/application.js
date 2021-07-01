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

// our application constructor
function application () {
	this.currentUser = 0;
	this.arInstallRatingUsers = {};
}

application.prototype.displayErrorMessage = function(message, arSelectors) {
	for (selector in arSelectors)
		$(selector).html(message);
}

application.prototype.displayCurrentUser = function(selector) {
	var currapp = this;
	
	BX24.callMethod('user.current', {}, function(result){
		currapp.currentUser = result.data().ID;
		$(selector).html(result.data().NAME + ' ' + result.data().LAST_NAME);
	});
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
						curapp.displayErrorMessage('К сожалению, произошла ошибка сохранения пользователей рейтинг. Попробуйте переустановить приложение',
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
				this.arInstallRatingUsers[idUser].SUM + ' (сделок: ' +
				this.arInstallRatingUsers[idUser].DEAL_COUNT + ')</p>' +
		'</div>' +
	'</div>';
	
	return itemHTML;

}

application.prototype.step4DisplayRatingData = function () {
	console.log('Все данные ', this.arInstallRatingUsers);			
	
	$('#rating-list').html('');
	
	var my_sum = 0, my_deals = 0, max_sum = 0;
	if (this.arInstallRatingUsers.hasOwnProperty(this.currentUser)) {
		my_sum = this.arInstallRatingUsers[this.currentUser].SUM;
		my_deals = this.arInstallRatingUsers[this.currentUser].DEAL_COUNT;
	}
	
	for (idUser in this.arInstallRatingUsers) {
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
				'<span class="list-group-item-heading">' + my_sum + '</span>' +
				'<p class="list-group-item-text text-success">сделок: ' + my_deals + '</p>' +
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

application.prototype.step3GetUserDeals = function (arIdsUser) {
	var curapp = this;

	// get daily date period	
	var today = nullifyDate(new Date()),
		yesterday = new Date(today);
		
	yesterday.setDate(yesterday.getDate() - 1);
	
	today = tempus(today).format('%Y-%m-%d');
	yesterday = tempus(yesterday).format('%Y-%m-%d');
	
	BX24.callMethod(
		"crm.deal.list", 
		{ 
			order: { "ASSIGNED_BY_ID": "ASC", "DATE_CREATE": "ASC" },
			filter: { 
				"ASSIGNED_BY_ID": arIdsUser, 
				"CLOSED": 'Y' /*,
				">=DATE_MODIFY": yesterday,
				"<DATE_MODIFY": today */
				},
			select: [ "ID", "TITLE", "OPPORTUNITY", "ASSIGNED_BY_ID"]
		}, 
		function(result) 
		{
			if (result.error()) {
				displayErrorMessage('К сожалению, произошла ошибка получения сделок. Попробуйте повторить отчет позже');
				console.error(result.error());
			}
			else
			{
				var data = result.data();
				
				for (indexDeal in data) {
					idUser = data[indexDeal].ASSIGNED_BY_ID;
					
					curapp.arInstallRatingUsers[idUser].SUM += parseFloat(data[indexDeal].OPPORTUNITY);
					curapp.arInstallRatingUsers[idUser].DEAL_COUNT++;
				}
							
				if (result.more())
					result.next();
				else {
					console.log('Получены данные о сделках');
					curapp.step4DisplayRatingData(arIdsUser);					
				}
					
			}
		}
	);	
}
	
application.prototype.step2GetUserData = function (arIdsUser) {
	var curapp = this;
	
	BX24.callMethod(
		'user.get', 
		{"ID": arIdsUser}, 
		function (result) {
		
			var data = result.data();
			
			for (userIndex in data) {
			
				idUser = data[userIndex].ID;
				curapp.arInstallRatingUsers[idUser].FIRST_NAME = data[userIndex].NAME;
				curapp.arInstallRatingUsers[idUser].LAST_NAME = data[userIndex].LAST_NAME;
				curapp.arInstallRatingUsers[idUser].MIDDLE_NAME = data[userIndex].SECOND_NAME;
				curapp.arInstallRatingUsers[idUser].PERSONAL_PHOTO = data[userIndex].PERSONAL_PHOTO;
				curapp.arInstallRatingUsers[idUser].SUM = 0;
				curapp.arInstallRatingUsers[idUser].DEAL_COUNT = 0;
				
			}
			
			if (result.more())
				result.next();
			else {
				console.log('Получена информация пользователей');
				curapp.step3GetUserDeals(arIdsUser);		
			}

		}
	);
}

application.prototype.step1GetRatingUsers = function () {
	var curapp = this;
	
	BX24.callMethod('entity.item.get', {
		ENTITY: 'users',
		SORT: {DATE_ACTIVE_FROM: 'ASC'}
		}, 
		
		function (result) {
		
			if (result.error()) {
				curapp.displayErrorMessage('К сожалению, произошла ошибка получения пользователей рейтинг. Попробуйте переустановить приложение',
					['#users']);
				console.error(result.error());
			}
			else
			{
				var data = result.data();
				console.log(data);

				// prepare array	
				var arIdsUser = [];
				for (indexUser in data) {
					arIdsUser.push(data[indexUser].PROPERTY_VALUES.ID_USER);
					curapp.arInstallRatingUsers[data[indexUser].PROPERTY_VALUES.ID_USER] = data[indexUser];
				}


                if (result.more())
                    result.next();
                else {
                    console.log('Получен список участников рейтинга');
                    curapp.step2GetUserData(arIdsUser);
                }
					
			}
		
		}
	);		
}

application.prototype.displayDeals = function () {
	
	var curapp = this;
	
	BX24.callMethod('user.current', {}, function(result){
		curapp.currentUser = result.data().ID;
		
		curapp.step1GetRatingUsers();
	});
	
}

// create our application
app = new application();
