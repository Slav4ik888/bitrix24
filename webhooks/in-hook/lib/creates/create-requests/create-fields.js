import { MethodType } from '../../../types.js';
import { createFieldsForCompanyContactAdd } from '../create-fields/create-fields.js';


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
    case MethodType.COMPANY_LIST:
    case MethodType.CONTACT_LIST:
      fields = { ORIGIN_ID: item.ORIGIN_ID };
      break;
    
    case MethodType.COMPANY_ADD:
    case MethodType.COMPANY_UPDATE:
      for (let key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          if (key !== `CONTACT`) fields[key] = item[key];
        }
      }
      break;
    

    case MethodType.CONTACT_ADD:
      // При создании передаётся целиком вся компания, поэтому нужно отделить данные контакта
      const contact = item.CONTACT; 
      for (let key in contact) {
        if (Object.prototype.hasOwnProperty.call(contact, key)) {
          fields[key] = contact[key];
        }
      }
      fields.ORIGIN_ID = item.ORIGIN_ID;
      break;
    
    
    case MethodType.CONTACT_UPDATE:
      // При обновлении попадают только данные самого контакта
      for (let key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          fields[key] = item[key];
        }
      }
      break;
    
    case MethodType.COMPANY_CONTACT_ADD:
      fields = createFieldsForCompanyContactAdd(item.CONTACT_ID);
      fields.ID = item.ID;
      break;
  }

  return fields;
};
