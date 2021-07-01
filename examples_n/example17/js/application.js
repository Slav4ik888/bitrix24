/* Routine */
(function () {
	/**
	 * Returns the class name of object.
	 * @param object {Object}
	 * @returns Class name of object
	 * @type String
	 */
	 var getClass = function (object) {
	   return Object.prototype.toString.call(object).slice(8, -1);
	 };
  
   /**
    * Returns true of obj is a collection.
    * @param obj {Object}
    * @returns True if object is a collection
    * @type {bool}
    */
	var isValidCollection = function (obj) {
		try {
			return (
				typeof obj !== "undefined" &&  // Element exists
				getClass(obj) !== "String" &&  // weed out strings for length check
				typeof obj.length !== "undefined" &&  // Is an indexed element
				!obj.tagName &&  // Element is not an HTML node
				!obj.alert &&  // Is not window
				typeof obj[0] !== "undefined"  // Has at least one element
			);
		} catch (e) {
			return false;
		}
	};
  
	/**
	 * Merges an array with an array-like object or
	 * two objects.
	 * @param arr1 {Array|Object} Array that arr2 will be merged into
	 * @param arr2 {Array|NodeList|Object} Array-like object or Object to merge into arr1
	 * @returns Merged array
	 * @type {Array|Object}
	 */
	window.array_merge = function (arr1, arr2) {
		// Variable declarations
		var arr1Class, arr2Class, i, il;

		// Save class names for arguments
		arr1Class = getClass(arr1);
		arr2Class = getClass(arr2);

		if (arr1Class === "Array" && isValidCollection(arr2)) {  // Array-like merge
			if (arr2Class === "Array") {
				arr1 = arr1.concat(arr2);
			} else {  // Collections like NodeList lack concat method
				for (i = 0, il = arr2.length; i < il; i++) {
					arr1.push(arr2[i]);
				}
			}
		} else if (arr1Class === "Object" && arr1Class === arr2Class) {  // Object merge
			for (i in arr2) {
				if (i in arr1) {
					if (getClass(arr1[i]) === getClass(arr2[i])) {  // If properties are same type
						if (typeof arr1[i] === "object") {  // And both are objects
							arr1[i] = array_merge(arr1[i], arr2[i]);  // Merge them
						} else {
							arr1[i] = arr2[i];  // Otherwise, replace current
						}
					}
				} else {
					arr1[i] = arr2[i];  // Add new property to arr1
				}
			}
		}
		return arr1;
	};
  
})();

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

function isset(aValue){
    return ((aValue !== undefined) && (aValue !== null));
}

// our application constructor
function application () {
	this.currentUser = 0;
	this.arInstallRatingUsers = new Object();
	
	// get daily date period	
	this.today = nullifyDate(new Date()),
	this.yesterday = new Date(this.today);
	this.yesterday.setDate(this.yesterday.getDate() - 1);
	
	this.today = tempus(this.today).format('%Y-%m-%d');	
	this.yesterday = tempus(this.yesterday).format('%Y-%m-%d');	
	
    this.appLoadedKeys = [];
	this.addLoadedKey('constructor');
	
	this.appUserOptions = {
		displayAvatars: true,
		images: {}
	};
	
	this.setDefaultImages();
	
	var curapp = this;
	
	$('#choose-file-dialog').on('shown.bs.modal', function () {
		$('#save-btn').addClass('disabled');
		// curapp.dirFiles(0);
		curapp.displayDir(undefined, '#file-list', '#save-btn');
	})	

	$('.rating-image').on('click', function() {
		curapp.changeImage($(this).data('place'));
	});
	
	this.getAppInfo();
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

application.prototype.finishInstallation = function () {
	
	// start saving
	$('#save-btn').find('i').removeClass('fa-check').addClass('fa-spinner').addClass('fa-spin');
	
	var authParams = BX24.getAuth(), 
		params = array_merge({operation: 'add_rating_users'}, authParams),
		params = array_merge(params, {'users': this.arInstallRatingUsers}),
		curapp = this;

	$.post(
		"application.php",
		params,
		function (data)
		{
			var answer = JSON.parse(data);
			if (answer.status == 'error') {
				console.log('error', answer.result);
				curapp.displayErrorMessage('К сожалению, произошла ошибка сохранения списка участников рейтинга. Попробуйте перезапустить приложение',
					['#error']);
			}
			else {
				BX24.callBind('ONAPPUNINSTALL', 'http://www.b24go.com/rating/application.php?operation=uninstall', 0, function(){
				    BX24.installFinish();
				});
			}
		}

	);
	
}

/* common methods */
application.prototype.getAppInfo = function() {
	this.appInfo = [];
    var arParameters = document.location.search;
    if (arParameters.length > 0) {
        arParameters = arParameters.split('&');
        for (var i = 0; i < arParameters.length; i++) {

            var aPair = arParameters[i].split('=');
            var aKey = aPair[0].replace(new RegExp("\\?", 'g'), "");

            this.appInfo[aKey] = aPair[1];
        }

        console.log('getAppInfo', this.appInfo);

    }
}

application.prototype.resizeFrame = function () {

	var currentSize = BX24.getScrollSize();
	minHeight = currentSize.scrollHeight;
	
	if (minHeight < 800) minHeight = 800;
	BX24.resizeWindow(this.FrameWidth, minHeight);

}

application.prototype.saveFrameWidth = function () {
	this.FrameWidth = document.getElementById("app").offsetWidth;
}
		
application.prototype.displayErrorMessage = function(message, arSelectors) {
	for (selector in arSelectors) {
		$(arSelectors[selector]).html(message);
		$(arSelectors[selector]).removeClass('hidden');
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
	if (!isset(this.appUserOptions.images[1])) this.setDefaultImages();
	
	for (imageIndex in this.appUserOptions.images)
		this.setRatingImage(imageIndex, this.appUserOptions.images[imageIndex]);
	
	if (BX24.isAdmin()) {
		$('#admin-options').removeClass('hidden');
		this.resizeFrame();
	}
	
	console.log('loaded options', this.appUserOptions);
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
application.prototype.setRatingImage = function(imageIndex, imageURL) {
	this.appUserOptions.images[imageIndex] = imageURL;
	$('#image-list').find('[data-place=' + imageIndex + ']').attr('src', imageURL);
	
	if (this.appLoadedKeys['constructor'].loaded === true) {
		this.saveOptions();
		this.isDataLoaded();
	}
}

application.prototype.setDefaultImages = function() {
	var defaultImages = {
		1: 'images/rating_1st.png',
		2: 'images/rating_2nd.png',
		3: 'images/rating_3d.png'
	}
	
	for (imageIndex in defaultImages)
		this.setRatingImage(imageIndex, defaultImages[imageIndex]);		
	
}

application.prototype.loadPlaceImage = function() {
	$('#choose-file-dialog').modal('hide');
			
	this.setRatingImage(this.changePlaceImage, '//' + this.appInfo.DOMAIN + '/disk/showFile/' + this.chosenFile.image + '/?&ncc=1&filename=' + this.chosenFile.name);

}

application.prototype.changeImage = function(place) {
	this.changePlaceImage = place;
	$('#choose-file-dialog').modal();
}


application.prototype.displayDir = function (itemElement, selectorFiles, selectorSave) {
	var list = $(selectorFiles),
		item = $(itemElement),
		itemId = item.data('object'),
		itemType = item.data('type'),
		itemName = item.data('name');
		
	$(selectorSave).addClass('disabled');	
	
	this.chosenFile = {};
	
	// 4 варианта: либо мы показываем хранилища, либо мы показываем каталоги конкретного хранилища, либо мы показываем содержимое каталога, либо мы выбрали файл
	// 1. itemElement = undefined
	// 2.  itemType = storage
	// 3. itemType = folder
	// 4. itemType = file
	
	if (!isset(itemElement)) listType = 'root'
	else listType = itemType;
	
	b24_iteminfo_command = '';
	
	switch (listType){
		case 'root':
			b24_command = 'disk.storage.getlist';
			b24_params = {};
			break;
		case 'storage':
			b24_iteminfo_command = 'disk.storage.get';
			b24_command = 'disk.storage.getchildren';
			b24_params = {id: itemId};
			break;
		case 'folder':
			b24_iteminfo_command = 'disk.folder.get';
			b24_command = 'disk.folder.getchildren';
			b24_params = {id: itemId};
			break;
	}
	
	function getFileList (result) {
	
		list.html('');
		
		// Сначала получаем информацию о текущем элементе, чтобы добавить ссылку на "предыдущий шаг"
		if (!isset(result))
			data = [];
		else {
			if (result.error())
				console.error(result.error());
			else 
				var data = result.data(); 
		}
		
		console.dir('current item', data);
		
		// Если мы только что зашли в хранилище, или выходили из папок, дойдя до корневой
		if  ((listType == 'storage') || ((listType == 'folder') && (!isset(data.PARENT_ID))) ) {
			list.append('<li onclick="app.displayDir(undefined, \'' + selectorFiles + '\', \'' + selectorSave + '\');" class="file-item"><i class="fa fa-reply"></i> ..</li>');
		}
		else {
			if (listType == 'folder') {	
				var parentType = 'folder';
				if (data.PARENT_ID == data.STORAGE_ID) parentType = 'storage';
				
				list.append('<li onclick="app.displayDir(this, \'' + selectorFiles + '\', \'' + selectorSave + '\');" data-object="' + data.PARENT_ID + '" data-type="' + 
					parentType + '" class="file-item"><i class="fa fa-reply"></i> ..</li>');	
			}			
		}
		
		// Теперь получаем список элементов текущего уровня
		BX24.callMethod(
			b24_command,
			b24_params,
			function (result)
			{
				if (result.error())
					console.error(result.error());
				else {
					var data = result.data(); 
					console.log('current items', data);
					
					for (itemIndex in data) {
					
						
						var icon = 'fa-folder', type = 'folder';
						if (isset(data[itemIndex].ENTITY_TYPE)) { 
							icon = 'fa-database'; // для папок и файлов ENTITY_TYPE не задано
							type = 'storage';
						}
						if (data[itemIndex].TYPE == 'file') { 
							icon = 'fa-file'; 
							type = 'file';
						}	
						
						list.append('<li onclick="app.displayDir(this, \'' + selectorFiles + '\', \'' + selectorSave + '\');" class="file-item" data-object="' + data[itemIndex].ID + '" data-type="' +
							type + '" data-name="' + data[itemIndex].NAME + '"><i class="fa ' + icon + '"></i> ' + data[itemIndex].NAME + '</li>');
					}
					
					
					if (result.more())
						result.next();
				}
			}
		);
		
	}
	
	
	if (b24_iteminfo_command != '')
		BX24.callMethod(
			b24_iteminfo_command,
			b24_params,
			getFileList
		);
	else {
		if (listType == 'file') {
			list.find('.file-item').removeClass('file-item-selected');
			item.addClass('file-item-selected');
			
			this.chosenFile.image = itemId;
			this.chosenFile.name = itemName;
			
			$(selectorSave).removeClass('disabled');	
		}
		else getFileList();
	}

}

application.prototype.toggleAvatars = function () {
	this.appUserOptions.displayAvatars = !this.appUserOptions.displayAvatars;
	$('#avatar-option').prop( "checked", this.appUserOptions.displayAvatars ? "checked" : null );

	this.saveOptions();
	this.isDataLoaded();
}

application.prototype.getUserBlockHTML = function (idUser, positionUser) {
	
	var avatar_str = '';
	
	if (this.appUserOptions.displayAvatars) {
		avatar_str = 
			'<div class="row-picture">' +
				'<img class="circle" src="' + this.arInstallRatingUsers[idUser].PERSONAL_PHOTO + '" alt="icon">';
		if (positionUser <= 3) 
			avatar_str += '<img class="circle" style="z-index:1000; position: absolute; left: -5px; top: -5px; height: 35px; width: 35px"' +
				'src="' + this.appUserOptions.images[positionUser] + '" alt="icon">';
				
		avatar_str += '</div>';
	}
		
	var itemHTML = '<div class="list-group-item list-group-item-overflow">' +
		avatar_str +
		'<div class="row-content">' +
			'<div class="action-secondary"><i class="mdi-material-info"></i></div>' +
			'<span class="list-group-item-heading">' + 
				this.arInstallRatingUsers[idUser].FIRST_NAME + ' ' +
				this.arInstallRatingUsers[idUser].LAST_NAME + 
				
				'</span>' +
			'<p class="list-group-item-text text-success">' +
				accounting.formatNumber(this.arInstallRatingUsers[idUser].RATE_SUM, 0, ' ') + '</p>' +
		'</div>' +
	'</div>';
	
	return itemHTML;

}

application.prototype.processUserInterface = function () {

	function compareUsers(userA, userB) {
		  return userB.RATE_SUM - userA.RATE_SUM;
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
		my_sum = this.arInstallRatingUsers[this.currentUser].RATE_SUM;
	
	for (indexUser in arSortedRatingUsers) {
		idUser = arSortedRatingUsers[indexUser].ID_USER;
		userHTML = this.getUserBlockHTML(idUser, parseInt(indexUser) + 1);

		if (max_sum < this.arInstallRatingUsers[idUser].RATE_SUM)
			max_sum = this.arInstallRatingUsers[idUser].RATE_SUM;
			
		$('#rating-list').append(userHTML);
	}
	$('#rating-list').append('<div class="clearfix"></div>');
	
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
					'<span class="list-group-item-heading">' + accounting.formatNumber(max_sum - my_sum, 0, ' ') + '</span>' +
					'<p class="list-group-item-text text-danger">осталось до лидера</p>' +
				'</div>' +
			'</div>	';	
			
		$('#rating-list-real').append(additionalHTML);
	}
	
	
}

application.prototype.SaveRatingData = function () {
	
	var curapp = this,
		params = array_merge({
			id_user: this.currentUser,
			sum: this.arInstallRatingUsers[this.currentUser].RATE_SUM,
			rate_date: this.yesterday,
			operation: 'add_rating'
		}, BX24.getAuth());

	
	if (this.idRating != 0) {
		params.id = this.idRating;
		params.operation = 'update_rating';
	}

	$.post(
		"application.php",
		params,
		function (data)
		{
			console.log('data', data);
			var answer = JSON.parse(data);
			console.log('answer', answer);
			
			if (answer.status == 'error') {
				console.log('error', answer.result);
				curapp.displayErrorMessage('К сожалению, произошла ошибка сохранения вашего рейтинга',
					['#error']);
			}
			else {
				
				console.log('Сохранены данные о сделках текущего пользователя');
				
			}
		}

	);	
	
}

application.prototype.displayDeals = function () {
		
	var curapp = this;
	this.appLoadedKeys['constructor'].loaded = true;
	
	/*
	this.addLoadedKey('user-list');
	this.addLoadedKey('user-data');
	
	this.GetRatingUsers();
	*/
	
	this.processUserInterface();
	this.SaveRatingData();
}

// create our application
app = new application();
