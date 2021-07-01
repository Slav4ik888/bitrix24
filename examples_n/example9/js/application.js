﻿/* Routine */
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

function isObject( mixed_var ) {
    return ( mixed_var instanceof Object );
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
	
	this.appUserOptions = {
		displayAvatars: true
	};
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

application.prototype.loadOptions = function() {
	var strUserOptions = BX24.userOption.get('options');
	if ((strUserOptions != undefined) && (strUserOptions != '')) {
		var _appUserOptions = JSON.parse(strUserOptions);
		if ((_appUserOptions != undefined) && (isObject(_appUserOptions)))
			this.appUserOptions = _appUserOptions;
	}
	
	if (!this.appUserOptions.displayAvatars) $('#avatar-option').prop( "checked", null );
}

application.prototype.saveOptions = function() {
	BX24.userOption.set('options', JSON.stringify(this.appUserOptions));
}

application.prototype.addLoadedKey = function(aKey) {
    this.appLoadedKeys[aKey] = {
        loaded: false
    };
}
		
/* application methods */
application.prototype.toggleAvatars = function () {
	this.appUserOptions.displayAvatars = !this.appUserOptions.displayAvatars;
	$('#avatar-option').prop( "checked", this.appUserOptions.displayAvatars ? "checked" : null );
	this.saveOptions();
	
	if (this.appLoadedKeys['user-data'].loaded) this.processUserInterface();
}

application.prototype.getUserBlockHTML = function (idUser) {
	
	var avatar_str = '';
	
	if (this.appUserOptions.displayAvatars)
		avatar_str = 
			'<div class="row-picture">' +
				'<img class="circle" src="' + this.arInstallRatingUsers[idUser].PERSONAL_PHOTO + '" alt="icon">' +
			'</div>';
		
	var itemHTML = '<div class="list-group-item">' +
		avatar_str +
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
			}
		}
	);
}

application.prototype.BatchGetData = function (arIdsUser) {
	var curapp = this;

	this.arInstallRatingUsers[curapp.currentUser].SUM = 0;
	this.idRating = 0;	
	
	var arRatingFilter = {
		'PROPERTY_ID_USER': arIdsUser,
		'PROPERTY_RATE_DATE': this.yesterday
	},
		arDealFilter = {
		"ASSIGNED_BY_ID": this.currentUser, 
		"CLOSED": 'Y'/*,
		">=DATE_MODIFY": yesterday,
		"<DATE_MODIFY": today */
	}
	
	var arCommands = {
		user_info: {
			method: 'user.get', 
			params: {
				ID: arIdsUser
			}
		},
		user_ratings: {
			method: 'entity.item.get',
			params: {
				ENTITY: 'ratings',
				SORT: {DATE_ACTIVE_FROM: 'ASC'},
				FILTER: arRatingFilter
			}
		},
		current_user_deals: {
			method: 'crm.deal.list',
			params: {
				order: { "DATE_CREATE": "ASC" },
				filter: arDealFilter,
				select: [ "ID", "TITLE", "OPPORTUNITY", "ASSIGNED_BY_ID"]
			}
		}
	};

	var batchCallback = function(result)
	{
		console.log('batch step', result);
	  
		var user_info_data = [], user_ratings_data = [], current_user_deals_data = [];
		
		if (arCommands.hasOwnProperty('user_info'))
			user_info_data = result.user_info.data();
		if (arCommands.hasOwnProperty('user_ratings'))
			user_ratings_data = result.user_ratings.data();
		if (arCommands.hasOwnProperty('current_user_deals'))
			current_user_deals_data = result.current_user_deals.data();
		
		// Формируем структуру для вывода полученных данных
		
		if (user_info_data.length > 0 )
			for (userIndex in user_info_data) {
			
				idUser = user_info_data[userIndex].ID;
				curapp.arInstallRatingUsers[idUser].FIRST_NAME = user_info_data[userIndex].NAME;
				curapp.arInstallRatingUsers[idUser].LAST_NAME = user_info_data[userIndex].LAST_NAME;
				curapp.arInstallRatingUsers[idUser].MIDDLE_NAME = user_info_data[userIndex].SECOND_NAME;
				curapp.arInstallRatingUsers[idUser].PERSONAL_PHOTO = user_info_data[userIndex].PERSONAL_PHOTO;
				
			}
			
		if (user_ratings_data.length > 0 )
			for (indexRatingUser in user_ratings_data) {
				idUser = user_ratings_data[indexRatingUser].PROPERTY_VALUES.ID_USER;

				if (curapp.currentUser == idUser) 
					curapp.idRating = user_ratings_data[indexRatingUser].ID;
				else					
					curapp.arInstallRatingUsers[idUser].SUM = user_ratings_data[indexRatingUser].PROPERTY_VALUES.SUM;
					
				curapp.arInstallRatingUsers[idUser].RATE_DATE = user_ratings_data[indexRatingUser].PROPERTY_VALUES.RATE_DATE;
				curapp.arInstallRatingUsers[idUser].ID_RATING_ITEM = user_ratings_data[indexRatingUser].ID;
			}
		
		if (current_user_deals_data.length > 0 )
			for (indexDeal in current_user_deals_data)
				curapp.arInstallRatingUsers[curapp.currentUser].SUM += parseFloat(current_user_deals_data[indexDeal].OPPORTUNITY);
		
      // instead of res.test1.next()
		var empty = true;
		for (var i in arCommands) {
			if (arCommands.hasOwnProperty(i)) {
				if (result[i].more()) {
					empty = false;
					arCommands[i].params.start = result[i].answer.next;
				}
				else delete arCommands[i];
			}
		}

		if (!empty) BX24.callBatch(arCommands, batchCallback);
		else {
			curapp.appLoadedKeys['user-data'].loaded = true;
			console.log('after batch step', cloneDebug(curapp.arInstallRatingUsers));
			curapp.isDataLoaded();
			
			curapp.SaveRatingData();			
		}
	}

   BX24.callBatch(arCommands, batchCallback);
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
					curapp.arInstallRatingUsers[idUser].SUM = 0;
				}
				
				//debug ('step 1 after ', curapp.arInstallRatingUsers, 1);
				
				if (result.more())
					result.next();
				else {
					
					console.log('step 1 after ', cloneDebug(curapp.arInstallRatingUsers));
					
					curapp.appLoadedKeys['user-list'].loaded = true;
					
					curapp.BatchGetData(arIdsUser);
					/*
					curapp.GetUserData(arIdsUser);
					curapp.GetCurrentUserDeals();
					curapp.GetUserRatingData(arIdsUser);	
					*/
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

	// this.addLoadedKey('rating-data');
	// this.addLoadedKey('user-deals');
	
	BX24.callMethod('user.current', {}, function(result){
		curapp.currentUser = result.data().ID;
		curapp.appLoadedKeys['current-user'].loaded = true;
		curapp.isDataLoaded();
	});
	
	this.GetRatingUsers();
	
}

// create our application
app = new application();
