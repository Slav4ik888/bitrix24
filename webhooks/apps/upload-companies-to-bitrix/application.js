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
}


class Application {
  constructor() {
    this.development;
    this.developmentShowLoadProcess;
    this.selectors;
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

      // Открываем кнопки
      this.selectors.updateCompaniesBtn.classList.remove(`hide`);
      this.selectors.newCompaniesBtn.classList.remove(`hide`);
    }

    this.readFile(e, callback);
  }


  // Обновить существующие компании подготовленными данными в BX24
  updateCompanies() {

  }


  // Создать новые компании в BX24
  newCompanies() {

  }


  

  // ******************************************** //
  //              DISPLAY METHODS                 //
  // ******************************************** //



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

  // ******************************************** //
  //              INITIALIZATION                  //
  // ******************************************** //

  start(selectors, mode, showLoadProcess) {
    this.development = mode;
    this.developmentShowLoadProcess = showLoadProcess;
    this.selectors = Object.assign({}, selectors);

    if (!this.development) {
      this.saveFrameWidth();
    }
  }
}

const app = new Application();

// git add . && git commit -m "start upload-companies application" && git push origin master

