import { MethodType } from '../../types.js';

/**
 * Возвращает строку запроса со всеми полями
 * 
 * @param {object} company
 * @param {MethodType} method 
 * @returns 
 */
const createReqStrFromAllFields = (company, method) => {
  let str = ``;
  switch (method) {
    case MethodType.COMPANY_LIST: str = `filter[ORIGIN_ID]=${company.ORIGIN_ID}`; break; 
    case MethodType.COMPANY_ADD: break;
    case MethodType.COMPANY_UPDATE: str = `id=${company.ID}`; break;
  }

  // for (let key in company) {
  //   if (Object.prototype.hasOwnProperty.call(company, key)) {
  //     if (str) str += `&fields[${key}]=${company[key]}`
  //     else str += `fields[${key}]=${company[key]}`
  //   }
  // }

  return str;
};


/**
 * Создаёт строки для запроса из загруженных данных по клиентам
 * для проверки по ORIGIN_ID
 * @param {Array} list 
 * @param {MethodType} method  
 * @returns {Array} reqList
 */
export const createReqList = (list, method) => {
  let reqList = [];

  list.forEach((item) => {
    const fields = {
      ORIGIN_ID: item.ORIGIN_ID,
    };
    const reqStr = createReqStrFromAllFields(fields, method);

    reqList.push(reqStr);
  });
  
  return reqList;
};