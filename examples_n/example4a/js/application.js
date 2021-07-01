// our application constructor
function application () {
	this.arDealSum = {};
}

application.prototype.displayErrorMessage = function(message) {
	$('#deal-list').html(message);
	$('#deal-sum').html(message);
}

application.prototype.displayCurrentUser = function(selector) {
	BX24.callMethod('user.current', {}, function(result){
		$(selector).html(result.data().NAME + ' ' + result.data().LAST_NAME);
	});
}

application.prototype.addRatingUserRow = function () {
	$('#deal-list').append('<tr><th><a href="javascript:void(0);" onclick="app.removeRatingUser(123);" class="btn btn-danger btn-fab btn-raised"><i class="fa fa-times"></i><div class="ripple-wrapper"></div></a></th><th>Иванов Иван</th></tr>');
}

application.prototype.displayUserClosedDeals = function (idUser) {

	this.arDealSum.idUser = 0;
	var dealHTML = '';
	
	var curapp = this;
	
	BX24.callMethod(
		"crm.deal.list", 
		{ 
			order: { "DATE_CREATE": "ASC" },
			filter: { "ASSIGNED_BY_ID": idUser, "CLOSED": 'Y' },
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
