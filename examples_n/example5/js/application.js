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
	this.arDealSum = {};
	this.arInstallRatingUsers = {};
}

application.prototype.displayErrorMessage = function(message, arSelectors) {
	for (selector in arSelectors)
		$(selector).html(message);
}

application.prototype.displayCurrentUser = function(selector) {
	BX24.callMethod('user.current', {}, function(result){
		$(selector).html(result.data().NAME + ' ' + result.data().LAST_NAME);
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
application.prototype.getUserClosedDeals = function (idUser) {

	this.arInstallRatingUsers[idUser].SUM = 0;
	this.arInstallRatingUsers[idUser].DEAL_COUNT = 0;
	
	var curapp = this;
	
	BX24.callMethod(
		"crm.deal.list", 
		{ 
			order: { "DATE_CREATE": "ASC" },
			filter: { "ASSIGNED_BY_ID": idUser, "CLOSED": 'Y'},
			select: [ "ID", "TITLE", "OPPORTUNITY"]
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
					curapp.arInstallRatingUsers[idUser].SUM += parseFloat(data[indexDeal].OPPORTUNITY);
					curapp.arInstallRatingUsers[idUser].DEAL_COUNT++;
				}
							
				if (result.more())
					result.next();
				else {
					console.log('Подсчитаны сделки пользователя ', curapp.arInstallRatingUsers[idUser].NAME);						
				}
					
			}
		}
	);
}

application.prototype.getUserData = function (idUser) {
	var curapp = this;
	
	BX24.callMethod(
		'user.get', 
		{"ID": idUser}, 
		function (result) {
		
			var data = result.data();
			curapp.arInstallRatingUsers[idUser].FIRST_NAME = data[0].NAME;
			curapp.arInstallRatingUsers[idUser].LAST_NAME = data[0].LAST_NAME;
			curapp.arInstallRatingUsers[idUser].MIDDLE_NAME = data[0].SECOND_NAME;
			curapp.arInstallRatingUsers[idUser].PERSONAL_PHOTO = data[0].PERSONAL_PHOTO;
			
			console.log('Получена информация пользователя ', curapp.arInstallRatingUsers[idUser].NAME);						

		}
	);
}

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
				this.arInstallRatingUsers[idUser].SUM + ' (' +
				this.arInstallRatingUsers[idUser].DEAL_COUNT + ')</p>' +
		'</div>' +
	'</div>';
	
	return itemHTML;

}

application.prototype.displayDeals = function () {
	
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
				for (indexUser in data) {
					curapp.arInstallRatingUsers[data[indexUser].PROPERTY_VALUES.ID_USER] = data[indexUser];
				}
				
				for (idUser in curapp.arInstallRatingUsers) {
					curapp.getUserData(idUser);
					curapp.getUserClosedDeals(idUser);
					
					userHTML = curapp.getUserBlockHTML(idUser);
					
					$('#rating-list').append(userHTML);
					console.log('Выведен блок пользователя ', curapp.arInstallRatingUsers[idUser].NAME);						
					
				}
					
					
			}
		
		}
	);	
	
}

application.prototype.displayCompleteData = function () {
	console.log('Все данные ', this.arInstallRatingUsers);			
	
	for (idUser in this.arInstallRatingUsers) {
		userHTML = this.getUserBlockHTML(idUser);
			
		$('#rating-list-real').append(userHTML);
	}
	
}

// create our application
app = new application();
