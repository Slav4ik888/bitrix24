// Methods bx24
import * as com from './company.js';
import * as cli from './contact.js';
// Functions
import { createFieldsForCompanyAdd, createRequestFields, createFieldsForCompanyContactAdd } from '../lib/create-fields/create-fields.js';



// Запрашиваем список компаний по полю ORIGIN_ID
export const companyList = (form) => {
  const ORIGIN_ID = form.ORIGIN_ID.value || "";
  const fields = createRequestFields({ ORIGIN_ID });

  return com.companyList(fields);
};



// const mockFields = {
//   "TITLE": `Тест_ Симонько Ирина Семёновна`, // Название компании
//   "ORIGIN_ID": "12",
//   "CREATED_BY_ID": CONSTS.CREATED_BY_ID,     // Кто создал 1 - Корзан Вячеслав
//   "ASSIGNED_BY_ID": CONSTS.ASSIGNED_BY_ID,   // Назначенный ответственный
//   "PHONE": [{ "VALUE": "+79501197000" }],
//   "EMAIL": [{ "VALUE": "korzan.va@mail.ru" }],
// };
  
export const companyAdd = (form) => {
  const TITLE = form.TITLE.value;
  const ORIGIN_ID = form.ORIGIN_ID.value || "";
  const CREATED_BY_ID = form.CREATED_BY_ID.value || "1";
  const ASSIGNED_BY_ID = form.ASSIGNED_BY_ID.value || "1";

  if (!TITLE) return console.log(`Не заполнено поле TITLE`);

  const fields = createFieldsForCompanyAdd({ TITLE, ORIGIN_ID, CREATED_BY_ID, ASSIGNED_BY_ID });
  
  return com.companyAdd(fields);
};



// Получаем данные компании
export const companyGet = (form) => {
  const companyId = form.companyId.value;
  return com.companyGet(companyId);
};



// Delete company by Id
export const companyDelete = (form) => {
  const companyId = form.companyId.value;
  return com.companyDelete(companyId);
};


// Получаем данные по контакту
export const contactGet = (form) => {
  const contactId = form.contactId.value;
  return cli.contactGet(contactId);
};





// Добавляем контакт к компании
export const companyContactAdd = (form) => {
  const companyId = form.companyId.value;
  const contactId = form.contactId.value;

  if (!companyId || !contactId) return console.log(`Поля должны быть заполнены`);

  const fields = createFieldsForCompanyContactAdd(contactId);

  return com.companyContactAdd(companyId, fields);
};


// Создаём новый контакт в BX
export const contactAdd = (form) => {
  const ADDRESS = form.ADDRESS.value || "";
  const NAME = form.NAME.value;
  const LAST_NAME = form.LAST_NAME.value || "";
  const SECOND_NAME = form.SECOND_NAME.value || "";

  const CREATED_BY_ID = form.CREATED_BY_ID.value || 1;
  const ASSIGNED_BY_ID = form.ASSIGNED_BY_ID.value || 1;
  const PHONE = form.PHONE.value || "";

  if (!NAME) return console.log(`Не заполнено поле ИМЯ`);

  const fields = createFieldsForContactAdd({ ADDRESS, NAME, LAST_NAME, SECOND_NAME, CREATED_BY_ID, ASSIGNED_BY_ID, PHONE: [{VALUE: PHONE}] });

  console.log('fields: ', fields);
  return cli.contactAdd(fields);
};


// Delete contact by Id
export const contactDelete = (form) => {
  const contactId = form.contactId.value;
  return cli.contactDelete(contactId);
};
