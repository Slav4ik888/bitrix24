import { MethodType } from '../../../types.js';

/**
 * Возвращает строку запроса со всеми полями
 * 
 * @param {object} company
 * @param {MethodType} method 
 * @returns 
 */
export const createReqStrFromAllFields = (item, method) => {
  let str = ``;
  switch (method) {
    case MethodType.COMPANY_LIST:
    case MethodType.CONTACT_LIST: 
      str = `filter[ORIGIN_ID]=${item.ORIGIN_ID}`;
      break;
    
    case MethodType.COMPANY_UPDATE:
    case MethodType.CONTACT_UPDATE:
      str = `id=${item.ID}`;

    case MethodType.COMPANY_ADD:
    case MethodType.CONTACT_ADD:
      for (let key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          if (str) str += `&`; // Для первого элемента значок не ставим
          if (key === `PHONE`) {
            str += `fields[${key}][0][VALUE]=${item.PHONE[0]?.VALUE}`;
            // str += `fields%5B${key}%5D%5B0%5D%5BVALUE%5D=${item.PHONE[0].VALUE}`;
          }
          else str += `fields[${key}]=${item[key]}`;
        }
      }
      
      break;

    case MethodType.COMPANY_CONTACT_ADD: str = `id=${item.ID}&fields[CONTACT_ID]=${item.CONTACT_ID}&fields[IS_PRIMARY]=Y`;
      break;
  }

  return str;
};