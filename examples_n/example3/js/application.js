// our application constructor
function application () {
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

application.prototype.displayUserClosedDeals = function (idUser) {

	var dealSum = 0, dealHTML = '';
	
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
                curapp.displayErrorMessage('К сожалению, произошла ошибка получения сделок. Попробуйте повторить отчет позже');
				console.error(result.error());
			}
			else
			{
				var data = result.data();
				
				for (indexDeal in data) {
					dealSum += parseFloat(data[indexDeal].OPPORTUNITY);
					dealHTML += '<tr><th scope="row">' + data[indexDeal].ID + '</th><td>' + data[indexDeal].TITLE +'</td><td>'
						+ data[indexDeal].OPPORTUNITY + '</td></tr>';
				}
							
				if (result.more())
					result.next();
				else {
					$('#deal-list').html(dealHTML);
					$('#deal-sum').html('<span class="volume">' + dealSum + '</span><br/>общая сумма');						
				}
					
			}
		}
	);
}

// create our application
app = new application();
