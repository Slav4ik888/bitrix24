import { createCompanyTitleByAddressFio } from '../create-company-title-by-address-fio/create-company-title-by-address-fio.js';
import { validateClient } from '../../validators/validate-client/validate-client.js';
import { createComment } from '../create-comment/create-comment.js';
import { Status } from '../../types/types-require.js';


// Возвращает полностью подготовленные данные для создания компании в Битрикс
export const prepareClient = (client) => {
  let refactedClient = {};

  refactedClient.ORIGIN_ID = client.id;
  refactedClient.CREATED_BY_ID = 1;  // Кто создал 1 - Корзан Вячеслав
  refactedClient.ASSIGNED_BY_ID = 1; // Назначенный ответственный
  refactedClient.CONTRACT = client.title; // Договор
  refactedClient.PHONE = [{ VALUE: client?.phone || null }];
  refactedClient.org = client.org;
  refactedClient.COMMENT = createComment(client);

  // Создаём название
  const result = createCompanyTitleByAddressFio(client.address, client.fio);
  refactedClient.TITLE = result.title;
  refactedClient.statusTitle = Status.VALID;



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
    client: refactedClient,
  };
}