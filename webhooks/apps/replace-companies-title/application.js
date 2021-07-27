// Возвращает длину объекта (кол-во элементов)
const objectLength = (arData) => {
  let result = 0;
  for (key in arData) result++;

  return result;
};

// Возвращает длину batch (кол-во элементов в cmd во всех пачках)
const batchLength = (batches) => {
  let bLength = 0;
  batches.forEach(batch => {
    bLength += objectLength(batch.cmd);
  });
  return bLength;
}




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

    // Компании с изменёнными данными;
    this.replacedCompanies = [];
    // Оставшееся кол-во компаний для обновления
    this.lengthReplacedCompanies = 0;

    // Загруженные ключи
    this.appLoadedKeys = [];

    this.selectors = {};
    // Условие по которому производить выборку
    this.findValue = null;
    // Условие на которое менять полученное значение
    this.replaceValue = null;

    // Mocks
  }


  // ******************** //
  //  MOCKS METHODS       //
  // ******************** //


  // Показываем процесс загрузки
  mockShowLoadProcess = (curApp, item, i, maxLength) => {
    setTimeout(() => {
      const sum = +[item].length + +curApp.companies.length;
      curApp.selectors.spinnerText.textContent = 'Загрузили ' + sum + ' ... ';
      curApp.companies.push(item);

      if (i === maxLength) curApp.displayAfterLoadedAllCompanies(curApp);
    }, 200 * i);
  };
  
  mockCreate210Companies() {
    for (let i = 1; i < 211; i++) {
      this.companies.push({ ID: `${449 + i}`, TITLE: "СпецКомпания - " + i })
    }
  };


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

  spinner(curApp, type) {
    if (type === `off`) {
      curApp.selectors.spinnerContainer.classList.add(`hide`);
      curApp.selectors.spinner.classList.remove(`circles-loader`);
      curApp.selectors.spinnerText.textContent = ``;
    } else {
      curApp.selectors.spinnerContainer.classList.remove(`hide`);
      curApp.selectors.spinner.classList.add(`circles-loader`);
    }
  }


  // ******************** //
  // APPLICATION METHODS  //
  // ******************** //


  // Получаем все компании и показываем их их
  async getAllCompanies() {
    const curApp = this;
    const params = {
      filter: { "OPENED": "Y" },
      select: ["ID", "TITLE"]
    };
    curApp.companies = [];
    

    if (this.isAppLoadedKeys(`allCompanies`)) {
      console.log(`Компании уже загружены`);
    }
    
    if (this.development) {
      this.mockCreate210Companies();
      console.log('curApp.companies: ', curApp.companies);
      
      if (this.developmentShowLoadProcess) {
        this.spinner(curApp);
        let i = 0;
        for await (let item of curApp.companies) {
          i++;
          this.mockShowLoadProcess(curApp, item, i, curApp.companies.length);
        }
      } else {
        this.displayAfterLoadedAllCompanies(this);
      }

      return;
    }
    
    this.spinner(this);
    // Получаем список всех компаний
    BX24.callMethod(`crm.company.list`, params, function (result) {
      if (result.error()) {
        curApp.displayErrorMessage(`К сожалению, произошла ошибка получения компаний. Попробуйте повторить позже`);
        console.error(result.error());

      } else {
        const data = result.data();
        const sum = +data.length + +curApp.companies.length;
        console.log('Загрузили ' + sum + ' ... ');
        curApp.selectors.spinnerText.textContent = 'Загрузили ' + sum + ' ... ';

        curApp.companies.push(...data);

        if (result.more()) {
          result.next();

        } else { // Всё загрузили
          curApp.displayAfterLoadedAllCompanies(curApp);
        }
      }
    });
  }


  /**
   * Вывести список отобранных компаний
   * @param {string} value - значение введённое пользователем
   * @returns 
   */
  displayCompanyFiltred(value) {
    this.selectors.companyResultContainer.classList.remove(`hide`);
    if (!value) {
      this.displayListCompany(this, this.companies);
    };

    const regexp = createRegExpByValue(value); // Создаём рег. выражение
    this.filtredCompanies = filtredByFieldAndRegexp(this.companies, `TITLE`, regexp);

    this.displayListCompany(this, this.filtredCompanies);

    // Открываем блок с возможностью добавить условие для замены
    this.selectors.requiestReplaceForm.classList.remove(`hide`);
  };


  // Вывести список компаний
  displayListCompany(curApp, list) {
    curApp.selectors.companyResultContainer.classList.remove(`hide`);
    curApp.selectors.resultCounter.textContent = `Всего: ` + list.length; // Кол-во
    curApp.selectors.companyListContainer.textContent = ``;

    list.forEach((company) => {
      const item = document.createElement(`li`);
      item.textContent = `ID: ${company.ID}, Название компании: ${company.TITLE}`;
      // Выводим в блок для сообщения
      curApp.selectors.companyListContainer.insertAdjacentElement ("beforeEnd", item);
    });
  };


  // Заменяем в отфильтрованных компаниях выбранный текст в TITLE
  replaceCompaniesTitle(findValue, replaceValue) {
    console.log(findValue, ` - заменить на: `, replaceValue);
    if (!findValue || !replaceValue || !this.filtredCompanies.length) return;

    const res = checkAndCorrectTitles(this.filtredCompanies, findValue, replaceValue);
    this.replacedCompanies = res || [];
    console.log('this.replacedCompanies: ', this.replacedCompanies);
    this.displayListCompany(this, this.replacedCompanies);
    this.selectors.saveBtn.disabled = false;
  };

  // Сохраняем подготовленные компании в Битрикс
  saveCompaniesToBitrix() {
    console.log(`Будем сохранять в Битрикс...`, this.replacedCompanies);
    // Подготавливаем пачку для отправки
    const listItems = this.createListForCompaniesUpdate();
    // console.log('listItems: ', listItems);

    const batches = this.createBatchesForCompaniesUpdate(listItems);
    console.log('Пачки для сохранения: ', batches);
    console.log('Подготовленное кол-во компаний на сохранение: ', batchLength(batches));

    if (!batchLength(batches)) {
      console.log(`Нет объектов для сохранения...`);
      return;
    }

    const curApp = this;
    let step = 0;

    const batchCallback = function (result) {
      console.log(result);
      step++;

      if (step === batches.length) return;

      BX24.callMethod(`batch`, batches[step], batchCallback);

    };

    //  Отправка первой пачки для обновления
    BX24.callMethod(`batch`, batches[step], batchCallback);
  }


  // Создаём строки списка компаний, подготовка для batch
  createListForCompaniesUpdate() {
    let listItems = [];
    this.replacedCompanies.forEach(company => {
      listItems.push(`id=${company.ID}&fields[TITLE]=${company.TITLE}`);
    });
      
    return listItems;
  };

  // Создаём 1 batch для массового обновления компаний
  createOneBatchForCompaniesUpdate(listItems) {
    const method = `crm.company.update`;
    let cmdObj = {};
  
    listItems.forEach((item, i) => cmdObj[method + i] = method + "?" + item);
    // console.log('cmdObj: ', cmdObj);

    const params = {
      "halt": 0,
      "cmd": cmdObj,
    };
    return params;
  };

  createBatchesForCompaniesUpdate(listItems) {
    let resultBatches = [];
    let batches50 = [];
    let lastMarker = 1;

    const pushToResultBatches = (batches) => {
      const params = this.createOneBatchForCompaniesUpdate(batches);
      // console.log('params: ', params);
      resultBatches.push(params);
    };

    listItems.forEach((requestStr, i) => {
      // Делим по 50
      let marker = Math.floor(i / 50);
      // console.log('i -' + i + '; marker: ', marker);

      if (marker < lastMarker) {
        batches50.push(requestStr);
      }
      else {
        batches50.push(requestStr);
        pushToResultBatches(batches50);
        lastMarker++;
        batches50 = [];
      }
    });

    pushToResultBatches(batches50);
    
    return resultBatches;
  }


  // ******************** //
  //   DOWNLOAD METHODS   //
  // ******************** //

  downloadCompanies() {
    console.log(`DOWNLOAD START`);
    console.log(`Загруженные компании:`, this.companies);

    const JSONdata = JSON.stringify(this.companies);

    this.selectors.companyListContainer.textContent = JSONdata;
  }

  // ******************** //
  //    DISPLAY METHODS   //
  // ******************** //

  
  // Вывести все элементы после загрузки всех компаний
  displayAfterLoadedAllCompanies = (curApp) => {
    curApp.selectors.getAllCompaniesBtn.value = `Загрузить повторно`;
    curApp.selectors.requiestFindForm.classList.remove(`hide`);
    curApp.selectors.downloadCompBtn.disabled = false;
    // curApp.selectors.requiestReplaceForm.classList.remove(`hide`);
    curApp.loadedKey(curApp, `allCompanies`); // Отмечаем что все компании загружены и больше загружать не нужно
    curApp.spinner(curApp, `off`);
    curApp.displayListCompany(curApp, curApp.companies);
    console.log(`Всего загружено компаний ${curApp.companies.length}`);
  };
  
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
  start(selectors, mode, showLoadProcess) {
    this.development = mode;
    this.developmentShowLoadProcess = showLoadProcess;
    this.selectors = Object.assign({}, selectors);
    this.saveFrameWidth();


    // this.displayCurrentUser(`#user-name`);
    // this.getAllCompanies();
  }

}


// create our application
app = new application();

// git add . && git commit -m "filter & cleanAddress" && git push origin master