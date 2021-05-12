/* Utils */

const deleteByKey = (arData, keyToRemove) => {
  for (let key in arData) {
    if (arData.hasOwnProperty(key) && (key == keyToRemove)) {
      delete arData[key];
    }
  }

  return arData;
};

// Возвращает длину объекта (кол-во элементов)
const objectLength = arData => {
  let result = 0;
  for (key in arData) result++;

  return result;
};

// Возвращает обнулённые даты
const nullifyDate = date => {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

// Копируем объект
const cloneDebug = arData => {
  const arTmp = JSON.stringify(arData);
  return JSON.parse(arTmp);
}

// Проверяем объект ли это
const isObject = item => item instanceof Object;

const isSet = aValue => aValue !== undefined;


// our application constructor
class application {

  constructor() {
    this.currentUser = 0;
    this.arInstallRatingUsers = {};
    this.appLoadedKeys = [];
    this.addLoadedKey(`constructor`);

    // Хранение пользовательских опций
    this.appUserOptions = {
      displayAvatars: true
    };
    // Хранение опций приложения
    this.appOptions = {
      images: {}
    };

    // get daily date period
    this.today = nullifyDate(new Date());
    this.yesterday = new Date(this.today);
    this.yesterday.setDate(this.yesterday.getDate() - 1);

    this.today = tempus(this.today).format('%Y-%m-%d');
    this.yesterday = tempus(this.yesterday).format('%Y-%m-%d');

    // Установить начальные картинки
    this.setDefaultImages();
    const curApp = this;

    $('#choose-file-dialog').on('shown.bs.modal', () => {
      $('#save-btn').addClass('disabled');
      // curApp.dirFiles(0);
      // Вывод на экран окно со списком файлов и директорий
      curApp.displayDir(undefined, '#file-list', '#save-btn');
    });

    $('.rating-image').on('click', () => {
      curApp.changeImage($(this).data('place'));
    });

    this.getAppInfo();
  }


  // COMMON METHODS

  // Изменение высоты фрейма
  resizeFrame() {
    const currentSize = BX24.getScrollSize();
    let minHeight = currentSize.scrollheight;

    if (minHeight < 400) minHeight = 400;
    BX24.resizeWindow(this.FrameWidth, minHeight);
  }

  // Сохранение ширины фрейма
  saveFrameWidth() {
    this.FrameWidth = document.getElementById(`app`).offsetWidth;
  }

  // Получаем ключи из location.search
  getAppInfo() {
    this.appInfo = [];
    let arParameters = document.location.search;
    console.log('document.location.search: ', arParameters);

    if (arParameters.length > 0) {
      arParameters = arParameters.split(`&`);
      
      for (let i = 0; i < arParameters.length; i++) {
        const aPair = arParameters[i].split(`=`);
        const aKey = aPair[0].replace(new RegExp("\\?", 'g'), "");

        this.appInfo[aKey] = aPair[1];
      }
    }
    console.log(`getAppInfo: `, this.appInfo);
  }

  // Проверяем ключи на true (по всем ли методам мы получили данные от сервера)
  isDataLoaded() {
    for (let keyIndex in this.appLoadedKeys)
      if (this.appLoadedKeys[keyIndex].loaded !== true) return;
    
    this.processUserInterface();
  }

  // Добавляем новый ключ в список проверки загружаемых данных
  addLoadedKey(aKey) {
    this.appLoadedKeys[aKey] = {
      loaded: false
    }
  }


  // Вывод списка ЗАКРЫТЫХ сделок пользователя и итоговой суммы
  getUserClosedDeals(idUser) {
    this.arInstallRatingUsers[idUser].SUM = 0;
	  this.arInstallRatingUsers[idUser].DEAL_COUNT = 0;

    const curApp = this;

    BX24.callMethod(
      `crm.deal.list`,
      {
        order: { "DATE_CREATE": `ASC` },
        filter: { "ASSIGNED_BY_ID": idUser, "CLOSED": `Y` },
        select: ["ID", "TITLE", "OPPORTUNITY"],
      },
      function (result) {
        if (result.error()) {
          curApp.displayErrorMessage(`К сожалению, произошла ошибка получения сделок. Попробуйте повторить отчет позже`);
          console.error(result.error());

        } else {
          const data = result.data();

          for (let indexDeal in data) {
            curApp.arInstallRatingUsers[idUser].SUM += parseFloat(data[indexDeal].OPPORTUNITY);
            curApp.arInstallRatingUsers[idUser].DEAL_COUNT++;
          }

          if (result.more()) {
            result.next();
          } else {
            console.log(`Подсчитаны сделки пользователя ${curApp.arInstallRatingUsers[idUser].NAME}`);
          }
        }
      }
    );
  }

  // Получаем данные о пользователе
  getUserData(arIdsUser) {
    const curApp = this;

    BX24.callMethod(`user.get`, { "ID": arIdsUser }, (result) => {
      const data = result.data();
      console.log('step 2', data);

      for (let userIndex in data) {
        const idUser = data[userIndex].ID;

        curApp.arInstallRatingUsers[idUser].FIRST_NAME = data[userIndex].NAME;
        curApp.arInstallRatingUsers[idUser].LAST_NAME = data[userIndex].LAST_NAME;
        curApp.arInstallRatingUsers[idUser].MIDDLE_NAME = data[userIndex].SECOND_NAME;
        curApp.arInstallRatingUsers[idUser].PERSONAL_PHOTO = data[userIndex].PERSONAL_PHOTO;
      }

      if (result.more()) {
        result.next()
      } else {
        console.log('Получена информация пользователей ');
        console.log('step 2 after ', cloneDebug(curApp.arInstallRatingUsers));

        curApp.appLoadedKeys[`user-data`].loaded = true;
        curApp.isDataLoaded();
      }
    });
  }

  // Сохраняем данные о сделках текущего пользователя
  saveRatingData() {
    const curApp = this;
    const arFields = {
      ENTITY: `ratings`,
      DATE_ACTIVE_FROM: new Date(),
      NAME: this.arInstallRatingUsers[this.currentUser].NAME,
      PROPERTY_VALUES: {
        ID_USER: this.currentUser,
        SUM: this.arInstallRatingUsers[this.currentUser].SUM,
        RATE_DATE: this.yesterday,
      }
    };
    let rest_command = `entity.item.add`;

    if (this.idRating != 0) {
      arFields.ID = this.idRating;
      rest_command = `entity.item.update`;
    }
    
    BX24.callMethod(rest_command, arFields, function (result) {
      if (result.error()) {
        curApp.displayErrorMessage(`К сожалению, произошла ошибка сохранения данных рейтинга. Попробуйте перезапустить приложение`, [`#error`]);
        console.error(result.error());
      } else {
        console.log(`Сохранены данные о сделках текущего пользователя`);
        // console.log(`step 5 after `, cloneDebug(curApp.arInstallRatingUsers));
      }
    });

  }


  batchGetData(arIdsUser) {
    const curApp = this;

    this.arInstallRatingUsers[curApp.currentUser].SUM = 0;
    this.idRating = 0;

    const arRatingFilter = {
      'PROPERTY_ID_USER': arIdsUser,
      'PROPERTY_RATE_DATE': this.yesterday
    };
    const arDealFilter = {
      'ASSIGNED_BY_ID': this.currentUser,
      'CLOSED': 'Y'/*,
      '>=DATE_MODIFY': yesterday,
      '<DATE_MODIFY': today */
    };
    const arCommands = {
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
          SORT: { DATE_ACTIVE_FROM: 'ASC' },
          FILTER: arRatingFilter
        }
      },
      current_user_deals: {
        method: 'crm.deal.list',
        params: {
          order: { "DATE_CREATE": "ASC" },
          filter: arDealFilter,
          select: ["ID", "TITLE", "OPPORTUNITY", "ASSIGNED_BY_ID"]
        }
      }
    };

    const batchCallback = function (result) {
      console.log(`batch step: `, result);

      let user_info_data = [];
      let user_ratings_data = [];
      let current_user_deals_data = [];

      if (arCommands.hasOwnProperty(`user_info`))
        user_info_data = result.user_info.data();
      if (arCommands.hasOwnProperty(`user_ratings`))
        user_ratings_data = result.user_ratings.data();
      if (arCommands.hasOwnProperty(`current_user_deals`))
        current_user_deals_data = result.current_user_deals.data();
      
      // Формируем структуру для вывода полученных данных

      if (user_info_data.length > 0) {
        for (let userIndex in user_info_data) {
          const idUser = user_info_data[userIndex].ID;
          curApp.arInstallRatingUsers[idUser].FIRST_NAME = user_info_data[userIndex].NAME;
          curApp.arInstallRatingUsers[idUser].LAST_NAME = user_info_data[userIndex].LAST_NAME;
          curApp.arInstallRatingUsers[idUser].MIDDLE_NAME = user_info_data[userIndex].SECOND_NAME;
          curApp.arInstallRatingUsers[idUser].PERSONAL_PHOTO = user_info_data[userIndex].PERSONAL_PHOTO;
        }
      }

      if (user_ratings_data.length > 0) {
        for (let indexRatingUser in user_ratings_data) {
          const idUser = user_ratings_data[indexRatingUser].PROPERTY_VALUES.ID_USER;
          console.log('idUser: ', idUser);

          if (curApp.currentUser === idUser)
            curApp.idRating = user_ratings_data[indexRatingUser].ID;
          else
            curApp.arInstallRatingUsers[idUser].SUM = user_ratings_data[indexRatingUser].PROPERTY_VALUES.SUM;
          
          curApp.arInstallRatingUsers[idUser].RATE_DATE = user_ratings_data[indexRatingUser].PROPERTY_VALUES.RATE_DATE;
          curApp.arInstallRatingUsers[idUser].ID_RATING_ITEM = user_ratings_data[indexRatingUser].ID;
        }
      }

      if (current_user_deals_data.length > 0)
        for (let idxDeal in current_user_deals_data) {
          console.log(`current_user_deals_data[idxDeal].OPPORTUNITY: `, current_user_deals_data[idxDeal].OPPORTUNITY);

          curApp.arInstallRatingUsers[curApp.currentUser].SUM += parseFloat(current_user_deals_data[idxDeal].OPPORTUNITY);
        }
      
      // instead of res.test1.next()
      let empty = true;
      for (let i in arCommands) {
        if (arCommands.hasOwnProperty(i)) {
          if (result[i].more()) {
            empty = false;
            arCommands[i].params.start = result[i].answer.next;
          } else {
            delete arCommands[i];
          }
        }
      }

      if (!empty) BX24.callBatch(arCommands, batchCallback);
      else {
        curApp.appLoadedKeys[`user-data`].loaded = true;
        console.log(`after batch step: `, cloneDebug(curApp.arInstallRatingUsers));
        curApp.isDataLoaded();

        curApp.saveRatingData();
      }
    }

    BX24.callBatch(arCommands, batchCallback);
  }


  // Получает сделки текущего пользователя
  getCurrentUserDeals() {
    const curApp = this;

    BX24.callMethod(`crm.deal.list`, {
      order: { "DATE_CREATE": "ASC" },
      filter: {
        "ASSIGNED_BY_ID": this.currentUser,
        "CLOSED": 'Y' /*,
        ">=DATE_MODIFY": yesterday,
        "<DATE_MODIFY": today */
      },
      select: [ "ID", "TITLE", "OPPORTUNITY", "ASSIGNED_BY_ID"]
    },
      function (result) {
        if (result.error()) {
          curApp.displayErrorMessage(`К сожалению, произошла ошибка получения ваших сделок. Попробуйте повторить отчет позже`,['#error']);
          console.error(result.error());
        } else {
          const data = result.data();
          console.log('step 4', data);
          console.log(`curApp.currentUser: `, curApp.currentUser);

          curApp.arInstallRatingUsers[curApp.currentUser].SUM = 0;

          for (let indexDeal in data)
            curApp.arInstallRatingUsers[curApp.currentUser].SUM += parseFloat(data[indexDeal].OPPORTUNITY);

          if (result.more()) {
            result.next();
          } else {
            console.log(`Получены данные о сделках текущего пользователя`);

            console.log(`step 4 after`, cloneDebug(curApp.arInstallRatingUsers));

            curApp.appLoadedKeys[`user-deals`].loaded = true;
            curApp.isDataLoaded();

            curApp.saveRatingData();
          }
        }
      }
    )
  }

  // 
  getUserRatingData(arIdsUser) {
    const curApp = this;
    this.idRating = 0;

    const arRatingFilter = {
      'PROPERTY_ID_USER': arIdsUser,
      'PROPERTY_RATE_DATE': this.yesterday
    };

    BX24.callMethod(`entity.item.get`, {
      ENTITY: `ratings`,
      SORT: { DATE_ACTIVE_FROM: "ASC" },
      FILTER: arRatingFilter
    }, function (result) {
      if (result.error()) {
        curApp.displayErrorMessage(`К сожалению, произошла ошибка получения данных рейтинга. Попробуйте переустановить приложение`, ['#error']);
        console.error(result.error());
      } else {
        const data = result.data();
        console.log(`step 3 `, data);

        for (let indexRatingUser in data) {
          const idUser = data[indexRatingUser].PROPERTY_VALUES.ID_USER;

          if (curApp.currentUser == idUser) {
            curApp.idRating = data[indexRatingUser].ID;
          } else {
            curApp.arInstallRatingUsers[idUser].SUM = data[indexRatingUser].PROPERTY_VALUES.SUM;
          }
          
          curApp.arInstallRatingUsers[idUser].RATE_DATE = data[indexRatingUser].PROPERTY_VALUES.RATE_DATE;
          curApp.arInstallRatingUsers[idUser].ID_RATING_ITEM = data[indexRatingUser].ID;
        }

        console.log(`Получена информация сохраненного рейтинга пользователей`);
        console.log(`step 3 after `, cloneDebug(curApp.arInstallRatingUsers));

        curApp.appLoadedKeys[`rating-data`].loaded = true;
        curApp.isDataLoaded();
      }
    })
  }

  // Получаем данные по пользователям участвующим в рейтинге
  getRatingUsers() {
    const curApp = this;
    this.arInstallRatingUsers = new Object();
    console.log(`step 1 befor `, curApp.arInstallRatingUsers);

    BX24.callMethod(`entity.item.get`, {
      ENTITY: `users`,
      SORT: { DATE_ACTIVE_FROM: `ASC`}
    },
      function (result) {
      
        if (result.error()) {
          curApp.displayErrorMessage(`К сожалению, произошла ошибка получения пользователей рейтинга. Попробуйте переустановить приложение`, [`#error`]);
          console.error(result.error());
        } else {
          const data = result.data();
          console.log('step 1', data);

          // prepare array
          const arIdsUser = [];
          for (let indexUser in data) {
            const idUser = data[indexUser].PROPERTY_VALUES.ID_USER;
            arIdsUser.push(idUser);
            curApp.arInstallRatingUsers[idUser] = {};
            curApp.arInstallRatingUsers[idUser].NAME = data[indexUser].NAME;
            curApp.arInstallRatingUsers[idUser].ID_USER = data[indexUser].PROPERTY_VALUES.ID_USER;
            curApp.arInstallRatingUsers[idUser].SUM = 0;
          }
        
          //debug ('step 1 after ', curapp.arInstallRatingUsers, 1);
          if (result.more()) result.next();
          else {
            console.log(`step 1 after `, cloneDebug(curApp.arInstallRatingUsers));

            curApp.appLoadedKeys[`user-list`].loaded = true;

            curApp.batchGetData(arIdsUser);
            
            // curApp.getUserData(arIdsUser);
            // curApp.getCurrentUserDeals();
            // curApp.getUserRatingData(arIdsUser);
          }
        }
    })
  }


  // Создаём ключи и получаем данные по текущему пользователю 
  displayDeals() {
    const curApp = this;
    this.appLoadedKeys[`constructor`].loaded = true;

    this.addLoadedKey(`current-user`);
    this.addLoadedKey(`user-list`);
    this.addLoadedKey(`user-data`);
    // this.addLoadedKey(`rating-data`);
    // this.addLoadedKey(`user-deals`);


    BX24.callMethod(`user.current`, {}, (result) => {
      curApp.currentUser = result.data().ID;
      console.log('curApp.currentUser: ', curApp.currentUser);
      curApp.appLoadedKeys[`current-user`].loaded = true;
      curApp.isDataLoaded();
    });

    this.getRatingUsers();
  }


  // Загружаем сохранённые опции (вызывается из html)
  loadOptions() {
    const strUserOptions = BX24.userOption.get(`options`);
    console.log('loadOptions strUserOptions: ', strUserOptions);

    if ((strUserOptions !== undefined) && (strUserOptions !== ``)) {
      const _appUserOptions = JSON.parse(strUserOptions);

      if ((_appUserOptions !== undefined) && (isObject(_appUserOptions)))
        this.appUserOptions = _appUserOptions;
        console.log('this.appUserOptions: ', this.appUserOptions);
    }

    const strOptions = BX24.appOption.get(`options`);
    console.log('loadOptions strOptions: ', strOptions);

    if ((strOptions !== undefined) && (strOptions !== '')) {
      const _appOptions = JSON.parse(strOptions);
      if ((_appOptions !== undefined) && (isObject(_appOptions)))
        this.appOptions = _appOptions;
        console.log('this.appOptions: ', this.appOptions);
    }

    // Проверяем вывод аватаров пользователей
    if (!this.appUserOptions.displayAvatars)
      $('#avatar-option').prop("checked", null);
    
    if (!isSet(this.appOptions.images[1])) {
      console.log(`Нет сохранённых картинок, устанавливаем по умолчанию`);
      this.setDefaultImages();
    }

    console.log('this.appOptions: ', this.appOptions);
    for (let imageIndex in this.appOptions.images)
      this.setRatingImage(imageIndex, this.appOptions.images[imageIndex]);
    
    // Проверяем права администратора
    if (BX24.isAdmin()) {
      $('#admin-options').removeClass('hidden');
      this.resizeFrame();
    }

    console.log("Загруженные options: ", this.appUserOptions, this.appOptions);
  }

  
  // Сохраняем опции в битрикс
  saveOptions() {
    console.log('saveOptions this.appUserOptions: ', this.appUserOptions);
    console.log('saveOptions this.appOptions: ', this.appOptions);

    BX24.userOption.set(`options`, JSON.stringify(this.appUserOptions));
    BX24.appOption.set(`options`, JSON.stringify(this.appOptions));
  }

  // APPLICATION METHODS

  // Сохраняем картинку рейтинга
  setRatingImage(imageIndex, imageURL) {
    console.log('imageIndex: ', imageIndex);
    console.log('imageURL: ', imageURL);

    this.appOptions.images[imageIndex] = imageURL;
    $('#image-list').find(`[data-place=${imageIndex}]`).attr('src', imageURL);

    if (this.appLoadedKeys['constructor'].loaded === true) {
      this.saveOptions();
      this.isDataLoaded();
    }
  }

  // Установить картинки по умолчанию
  setDefaultImages() {
    const defaultImages = {
      1: 'images/rating_1st.png',
      2: 'images/rating_2nd.png',
      3: 'images/rating_3d.png'
    }

    for (let imageIndex in defaultImages)
      this.setRatingImage(imageIndex, defaultImages[imageIndex]);
  }


  loadPlaceImage() {
    console.log('loadPlaceImage: ', this.changePlaceImage);
    console.log('this.appInfo.DOMAIN: ', this.appInfo.DOMAIN);

    $('#choose-file-dialog').modal('hide');

    this.setRatingImage(this.changePlaceImage, `//${this.appInfo.DOMAIN}/disk/showFile/${this.chosenFile.image}/?&ncc=1&filename=${this.chosenFile.name}`);
    console.log('Итоговая ссылка: ', `//${this.appInfo.DOMAIN}/disk/showFile/${this.chosenFile.image}/?&ncc=1&filename=${this.chosenFile.name}`);
  }

  changeImage(place) {
    this.changePlaceImage = place;
    $('#choose-file-dialog').modal();
  }

  // Вывод окошка со списко файлов и каталогов
  displayDir(itemElement, selectorFiles, selectorSave) {
    const list = $(selectorFiles);
    const item = $(itemElement);
    const itemId = item.data('object');
    const itemType = item.data('type');
    const itemName = item.data('name');

    $(selectorSave).addClass('disabled');

    // Выбранный файл
    this.chosenFile = {};

    // 4 варианта: либо мы показываем хранилища, либо мы показываем каталоги конкретного хранилища, либо мы показываем
    // содержимое каталога, либо мы выбрали файл
    // 1. itemElement = undefined
    // 2. itemType = storage
    // 3. itemType = folder
    // 4. itemType = file

    let listType = ``;

    if (!isSet(itemElement)) listType = `root`;
    else listType = itemType;

    let b24_iteminfo_command = ``;
    let b24_command = ``;
    let b24_params = {};
    
    switch (listType) {
      case `root`:
        b24_command = `disk.storage.getlist`;
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

    // Получаем список файлов находящихся в папке
    const getFileList = result => {
      list.html(``);

      // Сначала получаем информацию о текущем элементе, чтобы добавить ссылку на "предыдущий шаг"

      let data = [];
      if (isSet(result)) {
        if (result.error()) console.error(result.error());
        else data = result.data();
      }

      console.dir(`current item`, data);

      // Если мы только что зашли в хранилище, или выходили из папок, дойдя до корневой
      if ((listType === `storage`) || ((listType === `folder`) && (!isSet(data.PARENT_ID)))) {
        list.append(`<li onclick="app.displayDir(undefined, '${selectorFiles}', '${selectorSave}');" class="file-item"><i class="fa fa-reply"></i> ..</li>`);

      } else {
        if (listType === `folder`) {
          let parentType = `folder`;
          if (data.PARENT_ID === data.STORAGE_ID) parentType = `storage`;

          list.append(`<li onclick="app.displayDir(this, '${selectorFiles}', '${selectorSave}');" data-object="${data.PARENT_ID}" data-type="${parentType}" class="file-item"><i class="fa fa-reply"></i> ..</li>`);
        }
      }

      // Теперь получаем список элементов текущего уровня
      BX24.callMethod(b24_command, b24_params, function(result) {
        if (result.error()) console.error(result.error());
        else {
          const data = result.data();
          console.log(`current items: `, data);

          for (let itemIndex in data) {

            let icon = `fa-folder`, type = `folder`;
            if (isSet(data[itemIndex].ENTITY_TYPE)) {
              icon = `fa-database`; // для папок и файлов ENTITY_TYPE не задано
              type = `storage`;
            }
            if (data[itemIndex].TYPE === `file`) {
              icon = `fa-file`;
              type = `file`;
            }

            list.append(`
              <li onclick="app.displayDir(this, '${selectorFiles}', '${selectorSave}');" class="file-item" data-object="${data[itemIndex].ID}" data-type="${type}" data-name="${data[itemIndex].NAME}" style="cursor: pointer; margin-top: 5px;">
                <i class="fa ${icon}"></i>
                ${data[itemIndex].NAME}
              </li>
            `);
          }

          if (result.more()) result.next();
        }
      });
    }

    if (b24_iteminfo_command !== ``) {
      BX24.callMethod(b24_iteminfo_command, b24_params, getFileList);
      console.log('b24_iteminfo_command: ', b24_iteminfo_command);
      console.log('b24_params: ', b24_params);

    } else {
      if (listType === `file`) {
        list.find(`.file-item`).removeClass(`file-item-selected`);
        item.addClass(`file-item-selected`);

        this.chosenFile.image = itemId;
        console.log('this.chosenFile.image: ', this.chosenFile.image);
        
        this.chosenFile.name = itemName;
        console.log('this.chosenFile.name: ', this.chosenFile.name);

        $(selectorSave).removeClass(`disabled`);
      }
      else getFileList();
    }
  }


  toggleAvatars() {
    this.appUserOptions.displayAvatars = !this.appUserOptions.displayAvatars;
    $('#avatar-option').prop("checked", this.appUserOptions.displayAvatars ? "checked" : null);

    this.saveOptions(); // Сохраняем опции в BX24
    this.isDataLoaded(); // 

    // if (this.appLoadedKeys['user-data'].loaded) this.processUserInterface();
  }

  // Вывод и приветствие текущего пользователя
  displayCurrentUser(selector) {
    const curApp = this;

    BX24.callMethod('user.current', {}, (res) => {
        curApp.currentUser = result.data().ID;
        $(selector).html(res.data().NAME + ' ' + res.data().LAST_NAME);
      });
  }

  // Вывод ошибки в каждый селектор из arSelectors
  displayErrorMessage(message, arSelectors) {
    console.log('displayErrorMessage: ', message);
    for (let selector in arSelectors) {
      console.log('selector: ', selector);
      $(selector).html(message);
		  $(selector).removeClass('hidden');
    }
  }

  // Возвращает блок HTML для вывода данных пользователя
  getUserBlockHTML(idUser, positionUser) {
    let avatar_str = ``;

    if (this.appUserOptions.displayAvatars) {
      avatar_str = `
        <div class="row-picture">
				  <img class="circle" src="${this.arInstallRatingUsers[idUser].PERSONAL_PHOTO}" alt="icon">
      `;
      if (positionUser <= 3) // Если призовое место
        avatar_str += `<img class="circle" style="z-index:1000; position: absolute; left: -5px; top: -5px; height: 35px; width: 35px" src="${this.appOptions.images[positionUser]}" alt="icon">`;
      
      console.log('Место сотрудника: ', positionUser);
      console.log(`this.appOptions.images[positionUser]: `, this.appOptions.images[positionUser]);

      avatar_str += `</div>`;
    }
    return `
      <div class="list-group-item list-group-item-overflow">
        ${avatar_str}
        <div class="row-content">
          <div class="action-secondary"><i class="mdi-material-info"></i></div>
          <span class="list-group-item-heading">${this.arInstallRatingUsers[idUser].FIRST_NAME} ${this.arInstallRatingUsers[idUser].LAST_NAME}</span>
          <p class="list-group-item-text text-success">${accounting.formatNumber(this.arInstallRatingUsers[idUser].SUM, 0, ' ')}</p>
        </div>
      </div>
    `;
  }
  
  // Вроде как отрисовываем рейтинговые значения 
  processUserInterface() {
    const compareUsers = (userA, userB) => userB.SUM - userA.SUM;

    const arSortedRatingUsers = [];

    for (let idUser in this.arInstallRatingUsers)
      arSortedRatingUsers.push(this.arInstallRatingUsers[idUser]);
    
    arSortedRatingUsers.sort(compareUsers);

    console.log(`Все данные `, this.arInstallRatingUsers);
    console.log(`Отсортированные данные `, arSortedRatingUsers);

    $(`#rating-list`).html(``);

    let my_sum = 0, max_sum = 0;
    if (this.arInstallRatingUsers.hasOwnProperty(this.currentUser))
      my_sum = this.arInstallRatingUsers[this.currentUser].SUM;
    
    for (const indexUser in arSortedRatingUsers) {
      const idUser = arSortedRatingUsers[indexUser].ID_USER;
      const userHTML = this.getUserBlockHTML(idUser, parseInt(indexUser) + 1);

      if (max_sum < this.arInstallRatingUsers[idUser].SUM)
        max_sum = this.arInstallRatingUsers[idUser].SUM
      
      $('#rating-list').append(userHTML);
    }
    $('#rating-list').append('<div class="clearfix"></div>');

    let additionalHTML = `
      <div class="list-group-item">
        <div class="row-action-primary"><i class="fa fa-usd"></i></div>
        <div class="row-content text-success">
          <div class="action-secondary"><i class="mdi-material-info"></i></div>
          <span class="list-group-item-heading">${accounting.formatNumber(my_sum, 0, ' ')}</span>
        </div>
      </div>
    `;

    $(`#rating-list-real`).html(additionalHTML);

    if (my_sum < max_sum) {
      additionalHTML = `
        <div class="list-group-item">
          <div class="row-action-primary"><i class="fa fa-arrow-up"></i></div>
          <div class="row-content text-danger">
            <div class="action-secondary"><i class="mdi-material-info"></i></div>
            <span class="list-group-item-heading">${(max_sum - my_sum)}</span>
            <p class="list-group-item-text text-danger">осталось до лидера</p>
          </div>
        </div>
      `;
			
      $('#rating-list-real').append(additionalHTML);
    }
  }

  // Вывод результатов
  // displayCompleteData() {
  //   console.log(`Все данные ${this.arInstallRatingUsers}`);

  //   for (idUser in this.arInstallRatingUsers) {
  //     userHTML = this.getUserBlockHTML(idUser);
  //     $(`#rating-list-real`).append(userHTML);
  //   }
  // }



  // INSTALLATIONS METHODS

  // Добавляем строку для пользователя добавленного в рейтинг
  addRatingUserRow(arUser) {
    console.log('arUser: ', arUser);
    $(`#users`).append(`<li data-user-id="${arUser.id}"><a href="javascript:void(0);" onclick="app.removeRatingUser(${arUser.id});" class="btn btn-danger btn-raised"><i class="fa fa-times"></i><div class="ripple-wrapper"></div></a>${arUser.name}</li>`);
  }

  // Убираем пользователя из рейтинга
  removeRatingUser(idUser) {
    console.log('removeRatingUser: ', idUser);

    const result = confirm(`Вы уверены, что хотите удалить пользователя ${this.arInstallRatingUsers[idUser].name} из рейтинга?`);
    
    if (result) {
      $(`[data-user-id=${idUser}]`).remove();
      this.arInstallRatingUsers = deleteByKey(this.arInstallRatingUsers, idUser);
      app.checkSaving();

      console.log('this.arInstallRatingUsers: ', this.arInstallRatingUsers);
    }
  }

  // Добавляем пользователя в рейтинг
  addRatingUsers() {
    const curApp = this;

    BX24.selectUsers(function (users) {
      console.log('selectUsers (добавляемые пользователи): ', users);
      for (let indexUser in users) {
        // users - массив
        // indexUser - индексы 0, 1, 2, 3...

        // Проверяем есть ли уже кто-либо из этих пользователей в arInstallRatingUsers
        if (!curApp.arInstallRatingUsers.hasOwnProperty(users[indexUser].id)) {
          // {
          //   id: "1", 
          //   name: "Вячеслав Корзан",
          //   photo: "https://bitrix2.cdnvideo.ru/b8736981/resize_cache/511/7acf4cadf975128573a8b1c2766af5d8/main/b15/b155db4423ede7acc4f218c21f8908e4/IMG_9195.JPG?h=badcom.bitrix24.ru",
          //   position: "",
          //   sub: true,
          //   sup: false,
          // }

          curApp.arInstallRatingUsers[users[indexUser].id] = users[indexUser];
          curApp.addRatingUserRow(users[indexUser]);
        }
      }

      console.log('arInstallRatingUsers: ', curApp.arInstallRatingUsers);
      curApp.checkSaving();
    })
  }

  // Проверяем сохранили или нет
  checkSaving() {
    if (objectLength(this.arInstallRatingUsers) > 0) {
      $(`#save-btn`).removeClass(`disabled`);
      $(`#users`).removeClass(`hidden`);
      app.resizeFrame();

    } else {
      $(`#save-btn`).addClass(`disabled`);
      $(`#users`).addClass(`hidden`);
    }
  }

  // Подготовка Entities
  prepareEntity(arEntityDesc) {
    let batch = [];

    batch.push([`entity.add`, { "ENTITY": arEntityDesc.NAME, "NAME": arEntityDesc.DESC, "ACCESS": { AU: `W` } }]);
    batch.push([`entity.update`, { "ENTITY": arEntityDesc.NAME, "ACCESS": { AU: `W` } }]);

    for (let indexProperty in arEntityDesc.PROPERTIES) {
      batch.push([`entity.item.property.add`, {
        ENTITY: arEntityDesc.NAME,
        PROPERTY: arEntityDesc.PROPERTIES[indexProperty].CODE,
        NAME: arEntityDesc.PROPERTIES[indexProperty].NAME,
        TYPE: arEntityDesc.PROPERTIES[indexProperty].TYPE
      }]);
    }

    return batch;
  }

  // Завершение инсталляции
  finishInstallation() {
    // start saving
    $(`#save-btn`).find(`i`).removeClass(`fa-check`).addClass(`fa-spinner`).addClass(`fa-spin`);

    // define storages
    const arRatingUsersEntity = {
      NAME: `users`,
      DESC: `Rating users`,
      PROPERTIES: [
        { CODE: `ID_USER`, NAME: `User ID`, TYPE: `N` }
      ]
    };

    const arRatingDataEntity = {
      NAME: `ratings`,
      DESC: `Rating data`,
      PROPERTIES: [
        { CODE: `ID_USER`, NAME: `User ID`, TYPE: `N` },
        { CODE: `SUM`, NAME: `Daily sum`, TYPE: `N` },
        { CODE: `RATE_DATE`, NAME: `Rating Date`, TYPE: `S` },
      ]
    };

    let arEntityBatch = this.prepareEntity(arRatingUsersEntity);
    console.log('arEntityBatch: ', arEntityBatch);
    
    arEntityBatch = arEntityBatch.concat(this.prepareEntity(arRatingDataEntity));
    console.log('arEntityBatch: ', arEntityBatch);

    for (let user in this.arInstallRatingUsers) {
      arEntityBatch.push([`entity.item.add`, {
        ENTITY: `users`,
        DATA_ACTIVE_FROM: new Date(),
        NAME: this.arInstallRatingUsers[user].name,
        PROPERTY_VALUES: {
          ID_USER: this.arInstallRatingUsers[user].id,
        },
      }]);
    }

    const curApp = this;

    // console.log(`BX24.callBatch start`);

	  // Create storage and add rating users
    BX24.callBatch(arEntityBatch, function (result) {

      // Check saving of rating users
      BX24.callMethod(`entity.item.get`, {
        ENTITY: `users`,
        SORT: { DATE_ACTIVE_FROM: `ASC` },
      },
        function (result) {
          if (result.error()) {
            curApp.displayErrorMessage('К сожалению, произошла ошибка сохранения пользователей рейтинг. Попробуйте переустановить приложение',
              [`#users`]);
            console.error(result.error());

          } else {
            // console.log('Ok,  go to our application: ', result.data());
            BX24.installFinish();
          }
        }
      );
    });
  }


}


// create our application
app = new application();

