// Возвращает длину объекта (кол-во элементов)
const objectLength = (arData) => {
  let result = 0;
  for (key in arData) result++;

  return result;
};


// const { checkAndCorrectTitle } = require('./methods/check-and-correct-title/index');
// Возвращает true если title проходит валидацию (после _ стоит пробел)
const validateTitle = (title, idx) => {
  if (title.length === idx + 1) return true;
  if (title[idx + 1] !== ' ') return false;
  return true;
};


// return true if title validate
const checkTitle = (title) => {
  const result = {
    res: true,
    idx: -1,
  }
  if (!title) return result;

  const idx = title.indexOf(`_`);

  if (idx !== -1) {
    if (!validateTitle(title, idx)) { // Не валидный
      result.res = false;
      result.idx = idx;
    }
  }

  return result;
};

// Возвращает скорректированный title
const correctTitle = (title, idx) => title.slice(0, idx + 1) + ` ` + title.slice(idx + 1);

/**
 * 
 * @param {Object} obj { ID: "4491", TITLE: "СпецМос_ГорСтрой" }
 * @return {Object<valid: result.res, company> }
 */
const checkAndCorrectTitle = (_company) => {
  const company = Object.assign({}, _company);
  const result = checkTitle(company.TITLE);

  if (!result.res) { // incorrect title
    company.TITLE = correctTitle(company.TITLE, result.idx);
  }
  return { valid: result.res, company };
};



// CLASS

class application {

  constructor() {
    // Загруженные компании
    this.companies = [];

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


  // Вывод ошибки в каждый селектор из arSelectors
  displayErrorMessage(message, arSelectors) {
    console.log('displayErrorMessage: ', message);

    for (let selector in arSelectors) {
      console.log('selector: ', selector);
      $(selector).html(message);
      $(selector).removeClass('hidden');
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
  // Вывод списка ЗАКРЫТЫХ сделок пользователя и итоговой суммы
  getAllCompanies() {

    const curApp = this;
    const params = {
      filter: { "OPENED": "Y" },
      select: ["ID", "TITLE"]
    };

    // Получаем список всех компаний
    BX24.callMethod(`crm.company.list`, params, async function (result) {
      if (result.error()) {
        curApp.displayErrorMessage(`К сожалению, произошла ошибка получения сделок. Попробуйте повторить отчет позже`);
        console.error(result.error());

      } else {
        const data = result.data();
        console.log('data: ', data);

        // Проверяем полученные компании, исправляем не корректные
        // и сохраняем для последующей отправки
        data.forEach((company) => {
          const result = checkAndCorrectTitle(company);
          if (!result.valid) curApp.companies[`company${result.company.ID}`] = result.company;
        })
        console.log(objectLength(curApp.companies));

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
          await BX24.callMethod(`batch`, params, function (result) {
            console.log(result);
            curApp.companies = [];
            console.log('curApp.companies: ', curApp.companies);
          });
                
        }

        if (result.more()) {
          console.log(`NEXT`);
          result.next();
        } else {
          console.log(`Всего загружено компаний ${curApp.companies.length}`);
        }
      }
    }
    );
  }
  
  // APPLICATION METHODS

  // Вывод и приветствие текущего пользователя
  displayCurrentUser(selector) {
    const curApp = this;

    BX24.callMethod('user.current', {}, (res) => {
      curApp.currentUser = res.data().ID;
      $(selector).html(res.data().NAME + ' ' + res.data().LAST_NAME);
    });
  }

}


// create our application
app = new application();

