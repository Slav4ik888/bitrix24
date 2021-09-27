import * as com from '../../../controllers/company.js';
import * as cli from '../../../controllers/contact.js';
import { createRequestFields, createFieldsForCompanyContactAdd } from '../create-fields/create-fields.js';

export async function createNewCompanyWithContact(newCompanyData) {
  const newContactData = Object.assign({}, newCompanyData.CONTACT);
  delete newCompanyData.CONTACT;
  
  const { ORIGIN_ID } = newCompanyData;

  // Запрашиваем компанию по ORIGIN_ID
  if (ORIGIN_ID) {
    const fieldsList = createRequestFields({ ORIGIN_ID });
    const isOriginId = await com.companyList(fieldsList);

    // Если есть сообщаем, что компания с таким ORIGIN_ID уже есть
    if (isOriginId.length) return { valid: false, error: `Компания с ORIGIN_ID = ${ORIGIN_ID} уже есть в BX24` };
  }

  //  - создаём компанию
  const resCompanyId = await com.companyAdd(newCompanyData);
  console.log('resCompanyId: ', resCompanyId);
  
  //  - создаём контакт
  const resContactId = await cli.contactAdd(newContactData);
  console.log('resContactId: ', resContactId);

  //  - связываем компанию и контакт
  const fields = createFieldsForCompanyContactAdd(resContactId);

  const result = await com.companyContactAdd(resCompanyId, fields);
  console.log('Соединение с компанией: ', result);

}