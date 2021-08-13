import { CrmMethodType } from '../../types.js';

/**
 * Возвращает строку запроса со всеми полями
 * 
 * @param {object} company
 * @param {CrmMethodType} method 
 * @returns 
 */
export const makeReqStrFromAllFields = (company, method) => {
  let str = method === CrmMethodType.UPDATE ? `id=${company.ID}` : ``;

  for (let key in company) {
    if (Object.prototype.hasOwnProperty.call(company, key)) str += `&fields[${key}]=${company[key]}`
  }

  return str;
}