// Methods bx24
import * as com from './company.js';
// Functions
import { createRequestFields } from '../lib/create-request-fields/create-request-fields.js';



// Запрашиваем список компаний по полю ORIGIN_ID
export const companyList = async (form) => {
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
  
export const companyAdd = async (form) => {
  const TITLE = form.TITLE.value;
  const ORIGIN_ID = form.ORIGIN_ID.value || "";
  const CREATED_BY_ID = form.CREATED_BY_ID.value || "1";
  const ASSIGNED_BY_ID = form.ASSIGNED_BY_ID.value || "1";

  if (!TITLE) return console.log(`Не заполнено поле TITLE`);

  const fields = {
    "TITLE": TITLE, // Название компании
    "ORIGIN_ID": ORIGIN_ID,
    "CREATED_BY_ID": CREATED_BY_ID,     // Кто создал 1 - Корзан Вячеслав
    "ASSIGNED_BY_ID": ASSIGNED_BY_ID
  };
  
  return com.companyAdd(fields);
};



// Получаем данные компании
export const companyGet = async (form) => {
  const companyId = form.companyId.value;
  return com.companyGet(companyId);
};



// Delete company by Id
export const companyDelete = async (form) => {
  const companyId = form.companyId.value;
  return com.companyDelete(companyId);
};




// Добавляем контакт к компании
export const companyContactAdd = async (contact) => {
  // e.preventDefault();
  
  const fields = {
    "CONTACT_ID": contact.id, // - идентификатор контакта (обязательное поле)
    "IS_PRIMARY": true, // - флаг первичного контакта
  };

  const res = await m.crmCompanyContactAdd(contact.id, fields);

  if (res) console.log(`Контакт ${contact.id} добавлен к компании: `, res);
  else console.log(`Ошибка при создании компании: `, fields.TITLE);
};
