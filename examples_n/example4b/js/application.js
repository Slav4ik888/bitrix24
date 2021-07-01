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
	this.arInstallRaringUsers = {};
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


/* installation methods */
application.prototype.addRatingUserRow = function (arUser) {
	$('#users').append('<li data-user-id="' + arUser.id +'"><a href="javascript:void(0);" onclick="app.removeRatingUser(' + arUser.id + 
		');" class="btn btn-danger btn-raised"><i class="fa fa-times"></i><div class="ripple-wrapper"></div></a> ' +
		arUser.name + '</li>');
}

application.prototype.removeRatingUser = function (idUser) {
	result = confirm('Вы уверены, что хотите удалить пользователя ' + this.arInstallRaringUsers[idUser].name 
	  + ' из рейтинга?');
	if (result) {
		$('[data-user-id=' + idUser + ']').remove();
		this.arInstallRaringUsers = deleteByKey(this.arInstallRaringUsers, idUser);
		app.checkSaving();
		// console.log(this.arInstallRaringUsers);
	}
}

application.prototype.addRatingUsers = function() {
	var curapp = this;

	BX24.selectUsers(function(users) {
		for (var indexUser in users) {
			if (!curapp.arInstallRaringUsers.hasOwnProperty(users[indexUser].id)) {
				curapp.arInstallRaringUsers[users[indexUser].id] = users[indexUser];
				curapp.addRatingUserRow(users[indexUser]);
			}
		}
		curapp.checkSaving();
	});
}

application.prototype.checkSaving = function () {
	if (arrayLength(this.arInstallRaringUsers) > 0) {
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
	
	for (user in this.arInstallRaringUsers) 
		arEntityBatch.push(['entity.item.add', {
			ENTITY: 'users', 
			DATE_ACTIVE_FROM: new Date(), 
			NAME: this.arInstallRaringUsers[user].name,
			PROPERTY_VALUES: {
				ID_USER: this.arInstallRaringUsers[user].id
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
application.prototype.displayUserClosedDeals = function (idUser) {

	this.arDealSum.idUser = 0;
	var dealHTML = '';
	
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
					curapp.arDealSum.idUser += parseFloat(data[indexDeal].OPPORTUNITY);
					dealHTML += '<tr><th scope="row">' + data[indexDeal].ID + '</th><td>' + data[indexDeal].TITLE +'</td><td>'
						+ data[indexDeal].OPPORTUNITY + '</td></tr>';
				}
							
				if (result.more())
					result.next();
				else {
					$('#deal-list').html(dealHTML);
					$('#deal-sum').html('<span class="volume">' + curapp.arDealSum.idUser + '</span><br/>общая сумма');						
				}
					
			}
		}
	);
}

// create our application
app = new application();
