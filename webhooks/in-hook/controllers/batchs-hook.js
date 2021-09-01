import { HOOK_URL, paramsPOST } from '../consts/consts.js';
import { createTimer } from '../utils/timer/timer.js';
import { validationMethod, validationBatchList } from '../utils/validators/validators.js';
import { MethodType } from '../types.js';

const createTitleField = (str) => {
};


const getOriginIdFromStr = (str) => {
  const idxOrigin = str.indexOf(`ORIGIN_ID`);
  const idxStartId = idxOrigin + 9 + 2;

  const strAll = str.slice(idxStartId, idxStartId + 6);
  const idxEndId = strAll.indexOf(`&`);

  let ORIGIN_ID = ``;
  // Если нет & значит берём целиком (это для контакта)
  if (idxEndId !== -1) ORIGIN_ID = strAll.slice(0, idxEndId);
  else ORIGIN_ID = strAll;
  
  // ORIGIN_ID]=1015&field
  // console.log('strAll: ', strAll);
  // console.log('ORIGIN_ID: ', ORIGIN_ID);

  return ORIGIN_ID;
};

/**
 * Создаём 1 batch для массового обновления компаний
 * 
 * @param {*} listItems 
 * @param {METHOD} method
 * @returns params
 */
const createOneBatch = (listItems, method) => {
  let cmdObj = {};

  switch (method) {
    case MethodType.COMPANY_ADD:
    case MethodType.CONTACT_ADD:
      listItems.forEach((item, i) => {
        cmdObj[`ORIGIN_ID_` + getOriginIdFromStr(item)] = method + "?" + item;
      });
      break;
    
    default:
      listItems.forEach((item, i) => cmdObj[method + i] = method + "?" + item);
  }

  const params = {
    "halt": 0,
    "cmd": cmdObj,
  };
  return params;
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
    // console.log('Пачка в 50 batchs: ', params);
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



/**
 * Отправляет 1 batch запрос с переданным списком команд для вызова на стороне Bitrix24
 * @param {String} method 
 * @param {Array of string item} listItems пример строки "crm.lead.add?fields[TITLE]=Test3 lead by robot nah&fields[CREATED_BY_ID]=2",
 * @returns 
 */
async function sendOneBatch(batchItems) {
  try {
    paramsPOST.body = JSON.stringify(batchItems);

    const response = await fetch(`${HOOK_URL}/batch.json`, paramsPOST);
    const companyData = await response.json();
    console.log('Res companyData: ', companyData);
    console.log(`batch.json - successfully!`);
    return companyData;
  }
  catch (e) { console.log('e: ', e); }
};



// Отправляем все batches to BX24
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
