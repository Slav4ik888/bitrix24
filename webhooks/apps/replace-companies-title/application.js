// Возвращает длину объекта (кол-во элементов)
const objectLength = (arData) => {
  let result = 0;
  for (key in arData) result++;

  return result;
};

const mockCompanies = [
  { ID: "4491", TITLE: "_3423_ 213" },
  { ID: "4491", TITLE: "_ 3423_342" },
  { ID: "4491", TITLE: " Federal_company" },
  { ID: "4491", TITLE: " Federal_ company" },
  { ID: "4491", TITLE: "СпецМос_ГорСтрой" },
  { ID: "4492", TITLE: "СпецМос_ ГорСтрой" },
  { ID: "4493", TITLE: "_ СпецМосГорСтрой" },
  { ID: "4494", TITLE: "_СпецМосГорСтрой" },
  { ID: "4495", TITLE: "_" },
];



// CLASS

class application {

  constructor() {
    // Режим работы
    this.development = false;

    // Загруженные компании
    this.companies = [];
    // Отфильтрованные
    this.filtredCompanies = [];

    // Загруженные ключи
    this.appLoadedKeys = [];

    this.selectors = {};
    // Условие по которому производить выборку
    this.findValue = null;
    // Условие на которое менять полученное значение
    this.replaceValue = null;

  }


  // ******************** //
  // COMMON METHODS       //
  // ******************** //


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

  // Проверяем ключи на true (по всем ли методам мы получили данные от сервера)
  isAppLoadedKeys(key) {
    if (this.appLoadedKeys[key]?.loaded == true) return true;
    return false;
  }

  // Добавляем новый ключ в список проверки загружаемых данных
  addLoadedKey(aKey) {
    this.appLoadedKeys[aKey] = {
      loaded: false
    }
  }

  // Назначаем ключу значение true
  loadedKey(curApp, aKey) {
    curApp.appLoadedKeys[aKey] = {
      loaded: true
    }
  }

  spinner(selector, type) {
    if (type === `off`) {
      selector.classList.add(`hide`);
      selector.classList.remove(`circles-loader`);
    } else {
      selector.classList.remove(`hide`);
      selector.classList.add(`circles-loader`);
    }
  }

  createListItems() {
    console.log('this.companies: ', this.companies);
    let listItems = [];
    for (let keyId in this.companies) {
      listItems.push(`id=${this.companies[keyId].ID}&fields[TITLE]=${this.companies[keyId].TITLE}`);
    }
      
    return listItems;
  }

  createBatchForCompanyUpdate(listItems) {
    const method = `crm.company.update`;
    let cmdObj = {};
  
    listItems.forEach((item, i) => cmdObj[method + i] = method + "?" + item);
    console.log('cmdObj: ', cmdObj);

    let obj = {
      "halt": 0,
      "cmd": cmdObj,
    };
    return obj;
  }


  // ******************** //
  // APPLICATION METHODS  //
  // ******************** //


  // Получаем все компании и показываем их их
  getAllCompanies() {
    const curApp = this;
    const params = {
      filter: { "OPENED": "Y" },
      select: ["ID", "TITLE"]
    };
    
    if (this.isAppLoadedKeys(`allCompanies`)) {
      console.log(`Компании уже загружены`);
      // return callback(this);
    }
    
    if (this.development) {
      mockCompanies.forEach(item => this.companies.push(item));
      curApp.displayListCompany(curApp, curApp.companies);
      curApp.loadedKey(this, `allCompanies`);
      curApp.selectors.requiestFindForm.classList.remove(`hide`);
      curApp.selectors.requiestReplaceForm.classList.remove(`hide`);
      return;
    }
    
    this.spinner(this.selectors.spinner);

    // Получаем список всех компаний
    BX24.callMethod(`crm.company.list`, params, function (result) {
      if (result.error()) {
        curApp.displayErrorMessage(`К сожалению, произошла ошибка получения сделок. Попробуйте повторить отчет позже`);
        console.error(result.error());

      } else {
        const data = result.data();
        console.log('Загрузили ' + +data.length + +curApp.companies.length + ' ... ');

        curApp.companies.push(...data);

        if (result.more()) {
          result.next();

        } else { // Всё загрузили
          curApp.selectors.getAllCompaniesBtn.value = `Загрузить повторно`;
          curApp.selectors.requiestFindForm.classList.remove(`hide`);
          curApp.selectors.requiestReplaceForm.classList.remove(`hide`);
          curApp.loadedKey(curApp, `allCompanies`); // Отмечаем что все компании загружены и больше загружать не нужно
          curApp.spinner(curApp.selectors.spinner, `off`);
          curApp.displayListCompany(curApp, curApp.companies);
          console.log(`Всего загружено компаний ${curApp.companies.length}`);
        }
      }
    });
  }

  
  // Вывести список всех загруженных компаний
  // displayAllCompanies(curApp) {
  //   curApp.selectors.companyResultContainer.classList.remove(`hide`);
    
  //   this.displayListCompany(curApp, curApp.companies);

  //   // Открываем блок с возможностью добавить условие для замены
  //   curApp.selectors.requiestReplaceForm.classList.remove(`hide`);
  // };


  // Вывести список отобранных компаний
  displayCompanyFiltred() {
    this.selectors.companyResultContainer.classList.remove(`hide`);

    // const regexp = new RegExp(this.selectors.findValue.value, `i`);
    // const regexp = /_\p{L}/iu; // После _ идёт только буква
    // const regexp = /_\d/iu; // После _ идёт только цифрв
    console.log('regexp: ', regexp);

    this.filtredCompanies = this.filtredByFieldAndValue(this.companies, `TITLE`, regexp);

    this.displayListCompany(this, this.filtredCompanies);

    // Открываем блок с возможностью добавить условие для замены
    this.selectors.requiestReplaceForm.classList.remove(`hide`);
  };


  // Вывести список компаний
  displayListCompany(curApp, list) {
    curApp.selectors.companyResultContainer.classList.remove(`hide`);
    curApp.selectors.companyListContainer.textContent = ``;

    list.forEach((company) => {
      const item = document.createElement(`li`);
      item.textContent = `ID: ${company.ID}, Название компании: ${company.TITLE}`;
      // Выводим в блок для сообщения
      curApp.selectors.companyListContainer.insertAdjacentElement ("beforeEnd", item);
    });
  };


  // Возвращает отфильтрованный массив по полю и значению
  filtredByFieldAndValue = (arr, field, regexp) => arr.filter(item => regexp.test(item[field]));
  
  
  // [+] Получить все компании и сохранить их в companies
  // [+] Вывести все компании в виде списка

  // [-] Отфильтровать все компании по введённому ранее условию 
  //      Глобальная ф-я фильтрации должна принимать фильтрующую функцию filtredByFieldAndValue, 
  //      чтобы в дальнейшем можно было добавлять другие условия и параметры
  //      а глобальная ф-я не меняется
  // [-] Сохранить в значение filtredCompanies

  // [-] Открыть поле для ввода условия для замены
  // [-] При нажатии "старт", сохранить в resultCompanies полученным значением
  // [-] Вывести все компании в виде списка
  // [-] Открыть кнопку сохранить

  // [-] Обновить компании в Bitrix итоговыми значениям resultCompanies



  arch() {
    // Проверяем полученные компании, исправляем не корректные
    // и сохраняем для последующей отправки
    data.forEach((company) => {
      const result = checkAndCorrectTitle(company);
      if (!result.valid) curApp.companies[`company${result.company.ID}`] = result.company;
    })
    console.log(`Найдено всего компаний: `, objectLength(curApp.companies));

    // Demo test
    // const demo1 = checkAndCorrectTitle({ ID: "4567", TITLE: "Test_test" });
    // console.log('demo1: ', demo1);
    // const demo2 = checkAndCorrectTitle({ ID: "4568", TITLE: "Test_test" });
    // console.log('demo2: ', demo2);
    // curApp.companies[`demo1`] = demo1.company;
    // curApp.companies[`demo2`] = demo2.company;

    console.log('curApp.companies: ', curApp.companies);

    // Если были компании с исправленными TITLE
    if (objectLength(curApp.companies)) {
      // Подготавливаем пачку для отправки

      const listItems = curApp.createListItems();
      console.log('listItems: ', listItems);

      const params = curApp.createBatchForCompanyUpdate(listItems);
      console.log('params: ', params);

      // Отправляем для обновления
      BX24.callMethod(`batch`, params, function (result) {
        console.log(result);
        curApp.companies = [];
        console.log('curApp.companies: ', curApp.companies);
      });
                
    }
  
  }


  // ******************** //
  // DISPLAY METHODS      //
  // ******************** //

  
  
  
  // Вывод сообщения об ошибке
  displayErrorMessage(message) {
    const container = this.selectors.errorContainer;
    const body = this.selectors.errorBody;
    const closeIcon = this.selectors.errorCloseIcon;

    container.classList.remove(`hide`);
    body.textContent = message;

    closeIcon.addEventListener(`click`, () => {
      body.textContent = ``;
      container.classList.add(`hide`);
    });
  };

  // Вывод и приветствие текущего пользователя
  displayCurrentUser(selector) {
    const curApp = this;

    BX24.callMethod('user.current', {}, (res) => {
      curApp.currentUser = res.data().ID;
      const message = res.data().NAME + ' ' + res.data().LAST_NAME;
      selector.insertAdjacentHTML("beforeEnd", message);
    });
  }

  // Инициализация приложения
  start(selectors, mode) {
    this.development = mode;
    this.selectors = Object.assign({}, selectors);
    this.saveFrameWidth();


    // this.displayCurrentUser(`#user-name`);
    // this.getAllCompanies();
  }

}


// create our application
app = new application();

// git add . && git commit -am "рабочий процесс идёт..." && git push origin master