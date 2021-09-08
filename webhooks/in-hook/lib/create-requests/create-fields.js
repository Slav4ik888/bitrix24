import { MethodType } from '../../../types.js';
import { createFieldsForCompanyContactAdd } from '../../create-fields/create-fields.js';


/**
 * Возвращает поля для выбранного метода
 * 
 * @param {Object} item { ORIGIN_ID, ID, CONTACT ...}
 * @param {} method 
 * @returns 
 */
export const createFields = (item, method) => {
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

  return fields;
};