import { MethodType } from '../../types.js';
import { createFieldsForCompanyContactAdd } from '../create-fields/create-fields.js';



/**
 * Возвращает строку запроса со всеми полями
 * 
 * @param {object} company
 * @param {MethodType} method 
 * @returns 
 */
const createReqStrFromAllFields = (item, method) => {
  let str = ``;
  switch (method) {
    case MethodType.COMPANY_LIST: str = `filter[ORIGIN_ID]=${item.ORIGIN_ID}`; break;
    
    case MethodType.COMPANY_ADD:
    case MethodType.CONTACT_ADD:
      for (let key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          if (str) str += `&`; // Для первого элемента значок не ставим
          if (key === `PHONE`) {
            str += `fields[${key}]=%5B%7B%20%22VALUE%22%3A%20%22%2B${item.PHONE[0].VALUE}%22%20%7D%5D`;
          }
          else str += `fields[${key}]=${item[key]}`;
        }
      }
      
      break;
    
    // case MethodType.COMPANY_UPDATE: str = `id=${item.ID}`; break;

    case MethodType.COMPANY_CONTACT_ADD: str = `id=${item.ID}&fields[CONTACT_ID]=${item.CONTACT_ID}&fields[IS_PRIMARY]=Y`;
      break;

  }

  if (method === MethodType.COMPANY_CONTACT_ADD) console.log('str: ', str);

  return str;
};


const createFields = (item, method) => {
  let fields = {};
  
  switch (method) {
    case MethodType.COMPANY_LIST: fields = { ORIGIN_ID: item.ORIGIN_ID }; break;
    
    case MethodType.COMPANY_ADD:
      for (let key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          if (key !== `CONTACT`) fields[key] = item[key];
        }
      }
      break;
    
    // case MethodType.COMPANY_UPDATE: str = `id=${company.ID}`; break;

    case MethodType.CONTACT_ADD:
      const contact = item.CONTACT;
      for (let key in contact) {
        if (Object.prototype.hasOwnProperty.call(contact, key)) {
          fields[key] = contact[key];
        }
      }
      fields.ORIGIN_ID = item.ORIGIN_ID;
      break;
    
    case MethodType.COMPANY_CONTACT_ADD:
      fields = createFieldsForCompanyContactAdd(item.CONTACT_ID);
      fields.ID = item.ID;
      break;
  }

  console.log('fields: ', fields);

  return fields;
}

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