// Методы
const METHOD = {
  ADD: `crm.company.add`,
  UPDATE: `crm.company.update`,
};


// Возвращает названия всех полей и их значений в виде строки
const objectFieldsToString = (obj) => {
  let str = ``;

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str += `${key}: ${obj[key]}`;
      // if (obj[key] === `object`) objectFieldsToString(obj[key]);
      // else str += `${obj[key]}, `;
    }
  }
  return str;
};


// Возвращает длину объекта (кол-во элементов)
const objectLength = (arData) => {
  let result = 0;
  for (key in arData) result++;

  return result;
};

// Возвращает строку запроса со всеми полями
const makeReqStrFromAllFields = (company, method) => {
  let str = method === METHOD.UPDATE ? `id=${company.ID}` : ``;

  for (let key in company) {
    if (Object.prototype.hasOwnProperty.call(company, key)) str += `&fields[${key}]=${company[key]}`
  }

  return str;
}

// ******************************************** //
//              BATCHES METHODS                 //
// ******************************************** //


// Возвращает длину batch (кол-во элементов в cmd во всех пачках)
const batchLength = (batches) => {
  let bLength = 0;
  batches.forEach(batch => bLength += objectLength(batch.cmd));
  return bLength;
};


/**
 * Создаём строки запроса для списка компаний, (подготовка для batch)
 * 
 * @param {Array} companies 
 * @param {METHOD} method
 * @returns 
 */
const createListForCompanies = (companies, method) => {
  let listItems = [];
  companies.forEach(company => {
    listItems.push(makeReqStrFromAllFields(company, method));
    // listItems.push(`id=${company.ID}&fields[TITLE]=${company.TITLE}`);
  });
    
  return listItems;
};
  

/**
 * Создаём 1 batch для массового обновления компаний
 * 
 * @param {*} listItems 
 * @param {METHOD} method
 * @returns params
 */
const createOneBatch = (listItems, method) => {
  // const method = `crm.company.update`; // `crm.company.add`
  let cmdObj = {};

  listItems.forEach((item, i) => cmdObj[method + i] = method + "?" + item);
  // console.log('cmdObj: ', cmdObj);

  const params = {
    "halt": 0,
    "cmd": cmdObj,
  };
  return params;
};

/**
 * Создаём Batchs для обновления или добавления компаний
 * 
 * @param {Array<requestStr>} listItems подготовленные строки запроса для списка компаний
 * @returns resultBatches - подготовленные пачки по 50 штук
 */
const createBatches = (listItems, method) => {
  let resultBatches = [];
  let batches50 = [];
  let lastMarker = 1;

  // Создаём пачку в 50 batchs и сохраняем в resultBatches
  const pushToResultBatches = (batches, method) => {
    const params = createOneBatch(batches, method);
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
      pushToResultBatches(batches50, method);
      lastMarker++;
      batches50 = [];
      batches50.push(requestStr); // Добавляем последний прочитанный (51)
    }
  });

  pushToResultBatches(batches50, method);
  
  return resultBatches;
};


const prepareBatches = (companies, method) => {
  console.log(`Будем сохранять в Битрикс...`, companies);
  // Подготавливаем пачку для отправки
  // Создаём строки запроса для списка компаний, (подготовка для batch)
  const listItems = createListForCompanies(companies, method);
  console.log('listItems: ', listItems);

  const batches = createBatches(listItems, method);
  console.log('Пачки для сохранения: ', batches);
  console.log('Подготовленное кол-во компаний на сохранение: ', batchLength(batches));
  return batches;
}

// ******************************************** //
// -------------------------------------------- //
//                APPLICATION                   //
// -------------------------------------------- //
// ******************************************** //

class Application {
  constructor() {
    this.development;
    this.developmentShowLoadProcess;
    this.prodaction = true;
    this.selectors;

    this.companies = []; // Компании для отправки в BX24
  }

  // Сохранение ширины фрейма
  saveFrameWidth() {
    this.FrameWidth = document.getElementById(`app`).offsetWidth;
  }


  // ******************************************** //
  //              FILES METHODS                   //
  // ******************************************** //

  /**
   * Читает и возвращает данные текстового файла
   * @param {*} e 
   * @param {func} callback
   * @returns 
   */
  readFile(e, callback) {
    let selectedFile = e.target.files[0];

    const reader = new FileReader();
    reader.onload = function (e) {
      const fileContent = e.target.result;
      callback(fileContent);
    }

    reader.readAsText(selectedFile);
  }

  /**
   * Читает и сохраняет обработанные данные
   * @param {*} e 
   */
  readJSONAndProcessData(e) {
    // Запускаем после прочтения файла с данными
    const callback = (json) => {
      const data = JSON.parse(json);
      this.companies = [...data];
      console.log('this.companies: ', this.companies);
      this.displayListCompany(this, this.companies);

      // Открываем кнопки
      this.selectors.updateCompaniesBtn.classList.remove(`hide`);
      this.selectors.createNewCompaniesBtn.classList.remove(`hide`);
    }

    this.readFile(e, callback);
  }



  // ******************************************** //
  //              SAVE TO BITRIX24                //
  // ******************************************** //


  // Отправка подготовленных batches в BX24
  startBatchsToBX24(batches) {
    if (this.prodaction) {
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
  }

    
  // Создать новые компании или обновить существующие в BX24 из подготовленных данных
  // Сохраняем подготовленные компании в Битрикс
  startProcessCompanies(method) {
    const batches = prepareBatches(this.companies, method);

    if (!batchLength(batches)) {
      console.log(`Нет объектов для сохранения...`);
      return;
    }

    // Выводим список подготовленных requests
    this.displayListRequests(batches);
    
    // Запускаем отправку подготовленных batches в BX24
    this.startBatchsToBX24(batches);
  }



  // ******************************************** //
  //              DISPLAY METHODS                 //
  // ******************************************** //


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


  // Вывести список компаний
  displayListCompany(curApp, list) {
    curApp.selectors.companyResultContainer.classList.remove(`hide`);
    curApp.selectors.resultCounter.textContent = `Всего: ` + list.length; // Кол-во
    curApp.selectors.companyListContainer.textContent = ``;

    list.forEach((company) => {
      const item = document.createElement(`li`);
      item.textContent = objectFieldsToString(company);
      // Выводим в блок для сообщения
      curApp.selectors.companyListContainer.insertAdjacentElement ("beforeEnd", item);
    });
  };


  // Выводим список подготовленных requests
  displayListRequests(batches) {
    let listShow = [];

    batches.forEach((batch) => {
      for (let key in batch.cmd) {
        if (Object.prototype.hasOwnProperty.call(batch.cmd, key)) listShow.push({ [key]: batch.cmd[key] })
      }
    });
    console.log('listShow: ', listShow);

    this.displayListCompany(this, listShow);
  }



  // ******************************************** //
  //              INITIALIZATION                  //
  // ******************************************** //

  start(selectors, mode, showLoadProcess) {
    this.development = mode;
    this.prodaction = !mode;
    this.developmentShowLoadProcess = showLoadProcess;
    this.selectors = Object.assign({}, selectors);

    selectors.updateCompaniesBtn.addEventListener(`click`, () => this.startProcessCompanies(METHOD.UPDATE));
    selectors.createNewCompaniesBtn.addEventListener(`click`, () => this.startProcessCompanies(METHOD.ADD));
    
    if (!this.development) {
      this.saveFrameWidth();
    }
  }
}

const app = new Application();

// git add . && git commit -m "refact upload-companies application" && git push origin master

