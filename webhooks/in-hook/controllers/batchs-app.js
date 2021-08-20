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
 * Создаём Batchs для добавления компаний
 * 
 * @param {Array<requestStr>} listItems подготовленные строки запроса для списка компаний
 * @returns resultBatches - подготовленные пачки по 12 штук
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
//              SAVE TO BITRIX24                //
// ******************************************** //


// Отправка подготовленных batches в BX24
function startBatchsToBX24(batches) {
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
function startProcessCompanies(method) {
  const batches = prepareBatches(this.companies, method);

  if (!batchLength(batches)) {
    console.log(`Нет объектов для сохранения...`);
    return;
  }

  // Выводим список подготовленных requests
  this.displayListRequests(batches);
  
  this.selectors.saveBtn.disabled = false;
  this.selectors.saveBtn.addEventListener(`click`, () => {
    // console.log('Запускаем отправку подготовленных batches в BX24');
    // this.startBatchsToBX24(batches);
  });
}