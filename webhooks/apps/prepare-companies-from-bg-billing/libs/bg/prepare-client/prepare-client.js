import { createCompanyTitleByAddressFio } from '../create-company-title-by-address-fio/create-company-title-by-address-fio.js';
import { addLocaliy } from '../add-locality/add-locality.js';
import { getLocality } from '../get-locality/get-locality.js';
import { validateClient } from '../../../validators/validate-client/validate-client.js';
import { createComment } from '../../create-comment/create-comment.js';
import { getFio } from '../../../utils/get-fio/get-fio.js';
import { Status } from '../../../types/types-require.js';



/**
 * Возвращает полностью подготовленные данные по клиенту из BG для создания компании в Битрикс
 * @param {object} client 
 * @returns { valid, errors, client: preparedClient };
 */
export const prepareClient = (client) => {
  let preparedClient = {};

  preparedClient.ORIGIN_ID = client.id;
  preparedClient.CREATED_BY_ID = 1;       // Кто создал 1 - Корзан Вячеслав
  preparedClient.ASSIGNED_BY_ID = 1;      // Назначенный ответственный
  preparedClient.CONTRACT = client.title; // Договор
  // preparedClient.PHONE = [{ VALUE: client?.phone || null }];
  preparedClient.COMMENT = createComment(client);
  preparedClient.org = client.org;

  const address = addLocaliy(client); // Добавляем населённый пункт тем у кого отсутствует
  const locality = getLocality(address); // Оставляем только название населённого пункта
  
  preparedClient.LOCALITY = locality;

  // Создаём название
  const result = createCompanyTitleByAddressFio(locality, client.fio);
  preparedClient.TITLE = result.title;
  preparedClient.statusTitle = Status.VALID;

  // Добавляем поля для создания "Контакта" в BX24
  preparedClient.CONTACT = {};
  preparedClient.CONTACT.ADDRESS = address;
  
  const { LAST_NAME, NAME, SECOND_NAME } = getFio(client.fio);
  preparedClient.CONTACT.NAME = NAME;
  preparedClient.CONTACT.LAST_NAME = LAST_NAME;
  preparedClient.CONTACT.SECOND_NAME = SECOND_NAME
  
  preparedClient.CONTACT.PHONE = [{ VALUE: client?.phone || null }];
  preparedClient.CONTACT.CREATED_BY_ID = 1; 
  preparedClient.CONTACT.ASSIGNED_BY_ID = 1; 

  const {valid, errors} = validateClient(client);
  if (!valid) {
    // for (let key in errors) {
    //   if (Object.prototype.hasOwnProperty.call(errors, key)) {
    //     console.log(`NO VALID: ${key} = ${errors[key]}`);
    //   }
    // };
    return {
      valid: false,
      errors,
      client,
    };
  }
  


  return {
    valid: true,
    client: preparedClient,
  };
}