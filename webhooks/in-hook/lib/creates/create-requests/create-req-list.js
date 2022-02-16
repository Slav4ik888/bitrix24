import { MethodType } from '../../../types.js';
import { createFields } from './create-fields.js';
import { createReqStrFromAllFields } from './create-req-str-from-all-fields.js';

/**
 * Создаёт строки для запроса из загруженных данных по клиентам
 * 
 * @param {Array} list 
 * @param {MethodType} method  
 * @returns {Array} reqList
 */
export const createReqList = (list, method) => {
  let reqList = [];

  list.forEach((item) => {
    const fields = createFields(item, method);
    const reqStr = createReqStrFromAllFields(fields, method);

    reqList.push(reqStr);
  });
  
  return reqList;
};
