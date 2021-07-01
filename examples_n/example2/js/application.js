// our application constructor
function application () {
}

application.prototype.displayCurrentUser = function(selector) {
	BX24.callMethod(
        'user.current',
        {},
        function(result){
		    $(selector).html('Hello ' + result.data().NAME + ' ' + result.data().LAST_NAME + '!');
	    }
    );
}

// create our application
app = new application();
