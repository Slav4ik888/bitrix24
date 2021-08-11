// Methods bx24
import * as m from './company-methods-bx24.js';
// Consts
import { CONSTS } from '../consts.js';


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
  
  console.log('fields: ', fields);

  return m.crmCompanyAdd(fields);
};



// Получаем данные компании
export const companyGet = async (form) => {
  const companyId = form.companyId.value;
  return m.crmCompanyGet(companyId);

  // if (res) return res;// console.log(`Данные компании: `, res);
  // else console.log(`Ошибка при получении данных по компании: `, value);
};


// Delete company by Id
export const companyDelete = async (form) => {
  const companyId = form.companyId.value;
  return m.crmCompanyDelete(companyId);

  // if (res) return res;// console.log(`Данные компании: `, res);
  // else console.log(`Ошибка при получении данных по компании: `, value);
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
