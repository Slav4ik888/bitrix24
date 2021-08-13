// Methods bx24
import * as m from './company-methods-bx24.js';
// Consts
import { CONSTS } from '../consts/consts.js';


// Запрашиваем список компаний по полю ORIGIN_ID
export const companyList = async (fields) => m.crmCompanyList(fields);



// const mockFields = {
//   "TITLE": `Тест_ Симонько Ирина Семёновна`, // Название компании
//   "ORIGIN_ID": "12",
//   "CREATED_BY_ID": CONSTS.CREATED_BY_ID,     // Кто создал 1 - Корзан Вячеслав
//   "ASSIGNED_BY_ID": CONSTS.ASSIGNED_BY_ID,   // Назначенный ответственный
//   "PHONE": [{ "VALUE": "+79501197000" }],
//   "EMAIL": [{ "VALUE": "korzan.va@mail.ru" }],
// };
  
export const companyAdd = async (fields) => m.crmCompanyAdd(fields);


// Получаем данные компании
export const companyGet = async (companyId) => m.crmCompanyGet(companyId);


// Delete company by Id
export const companyDelete = async (companyId) => m.crmCompanyDelete(companyId);



// Добавляем контакт к компании
// export const companyContactAdd = async (contact) => {
//   // e.preventDefault();
  
//   const fields = {
//     "CONTACT_ID": contact.id, // - идентификатор контакта (обязательное поле)
//     "IS_PRIMARY": true, // - флаг первичного контакта
//   };

//   const res = await m.crmCompanyContactAdd(contact.id, fields);

//   if (res) console.log(`Контакт ${contact.id} добавлен к компании: `, res);
//   else console.log(`Ошибка при создании компании: `, fields.TITLE);
// };
