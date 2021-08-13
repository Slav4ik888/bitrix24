import * as com from '../../controllers/company.js';
import { createRequestFields } from '../create-request-fields/create-request-fields.js';

export async function createNewCompanyWithContact(newCompanyData) {
  const { ORIGIN_ID } = newCompanyData;

  // Запрашиваем компанию по ORIGIN_ID
  const fieldsList = createRequestFields({ ORIGIN_ID });
  console.log('fieldsList: ', fieldsList);

  const isOriginId = await com.companyList(fieldsList);
  console.log('isOriginId: ', isOriginId.length);

  // Если есть сообщаем, что компания с таким ORIGIN_ID уже есть
  if (isOriginId.length) return { valid: false, error: `Компания с ORIGIN_ID = ${ORIGIN_ID} уже есть в BX24` };

  //  - создаём компанию
  const resCompanyAdd = await com.companyAdd(newCompanyData);
  console.log('resCompanyAdd: ', resCompanyAdd);
  
  //  - создаём контакт
  //  - связываем компанию и контакт

}