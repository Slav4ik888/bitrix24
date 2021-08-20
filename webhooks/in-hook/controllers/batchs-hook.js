import { HOOK_URL, paramsPOST } from '../consts/consts.js';
import { validationMethod, validationBatchList } from '../utils/validators/validators.js';



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
 * Отправляет 1 batch запрос с переданным списком команд для вызова на стороне Bitrix24
 * @param {String} method 
 * @param {Array of string item} listItems пример строки "crm.lead.add?fields[TITLE]=Test3 lead by robot nah&fields[CREATED_BY_ID]=2",
 * @returns 
 */
async function sendOneBatch(batchItems) {
  // {
  //   const { valid, errors } = validationBatchList(batchItems);
  //   if (!valid) {
  //     console.log('errors: ', errors);
  //     return errors;
  //   }
  // }

  try {
    paramsPOST.body = JSON.stringify(batchItems);

    const response = await fetch(`${HOOK_URL}/batch.json`, paramsPOST);
    const companyData = await response.json();
    console.log('companyData: ', companyData);
    console.log(`${HOOK_URL}/batch.json - successfully!`);
    // return batchItems.cmd[`crm.company.list0`];
    return companyData;
  }
  catch (e) { console.log('e: ', e); }
};

// Счётчик подсчёта времени
function createTimer() {
  function timer(type) {
    timer.calls.push({ type, time: new Date() / 1000 });
  }

  timer.calls = [];
  return timer;
};


// Создаём много тестовых методов
export async function sendAllBatches(batches, cbResultFunc) {
  console.log(`Start send all batches`);

  let result = [];
  let timer = createTimer(); // Время промежуточных циклов


  const callback = (res, finish) => {
    timer(`callback start`);
    console.log('callback: ', finish);
    result.push(res);

    if (finish) cbResultFunc(result, timer);
  };

  const setDelay = (key, finish) => {
    timer(`setDelay: ${key}`);

    setTimeout(async () => {
      timer(`setTimeout ${key}`);
      console.log(`setDelay `, key);

      const res = await sendOneBatch(batches[key]);
      callback(res, finish);
    }, 1500 * key);
  }

  for (let key = 0; key < batches.length; key++) {
    timer(`for batches: ${key}`)
    
    let finish = key + 1 === batches.length;
    console.log('finish: ', finish);
    setDelay(key, finish);
  }
};



/**
 * Создаём Batchs по 50 шт
 * 
 * @param {Array<requestStr>} listItems подготовленные строки запроса для списка компаний
 * @returns resultBatches
 */
export const createBatches = (listItems, method) => {
  let resultBatches = [];
  let batches50 = [];
  let lastMarker = 1;

  // Создаём пачку в 50 batchs и сохраняем в resultBatches
  const pushToResultBatches = (batches, method) => {
    const params = createOneBatch(batches, method);
    console.log('params: ', params);
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




