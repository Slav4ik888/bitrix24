import { createCompanyTitleByAddressFio } from '../create-company-title-by-address-fio/create-company-title-by-address-fio.js';
import { getLocality } from '../get-locality/get-locality.js';
import { validateClient } from '../../../validators/validate-client/validate-client.js';
import { createComment } from '../../create-comment/create-comment.js';
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
  preparedClient.PHONE = [{ VALUE: client?.phone || null }];
  preparedClient.COMMENT = createComment(client);
  preparedClient.org = client.org;

  const locality = getLocality(client.address);
  preparedClient.LOCALITY = locality;

  // Создаём название
  const result = createCompanyTitleByAddressFio(locality, client.fio);
  preparedClient.TITLE = result.title;
  preparedClient.statusTitle = Status.VALID;

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