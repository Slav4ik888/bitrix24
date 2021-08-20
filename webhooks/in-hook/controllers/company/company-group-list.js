import { createReqList } from '../../lib/create-req-str-from-all-fields/create-req-str-from-all-fields.js';
import { createBatches, sendAllBatches } from '../batchs-hook.js';
import { MethodType } from '../../types.js';


// Выборка записей где вернулся результат, что компания с таким ORIGIN_ID существует
const getExistingClients = (data) => {
  let result = [];

  for (let key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const objRes = data[key].result.result;
      for (let objKey in objRes) {
        if (Object.prototype.hasOwnProperty.call(objRes, objKey)) {
          if (objRes[objKey].length) result.push(objRes[objKey]);
        }
      }
    }
  }

  return result;
};

// Добавляет пробелы и возвращает строку заданной длины
const createAddSpace = (l) => {
  let L = l;

  return function (str) {
    let newStr = str;
    let lack = L - str.length;
    if (lack > 0) {
      for (let i = 0; i < lack - 1 ; i++) {
        newStr += ` `;
      }
      newStr += `: `;
    }
    return newStr;
  }
};

const addSpace = createAddSpace(17);

// Вывести списком все значения таймера
const showTimer = (arr) => {
  arr.forEach((item => console.log(addSpace(item.type) + item.time)))
};


// Делаем запрос по всем компаниям и получаем результат о наличии ORIGIN_ID
export async function companyGroupList(readedData, callback) {

  // Создаём строки запроса по ORIGIN_ID
  const reqList = createReqList(readedData, MethodType.COMPANY_LIST);
  
  // Делим по пачкам 50шт
  const batches = createBatches(reqList, MethodType.COMPANY_LIST);
  console.log('batches: ', batches);

  // Обработка полученных результатов
  const cbListResult = (res, timer) => {
    showTimer(timer.calls);
    const existingClients = getExistingClients(res);
    return callback(existingClients);
  }

  // Отправляем запрос
  sendAllBatches(batches, cbListResult);
}