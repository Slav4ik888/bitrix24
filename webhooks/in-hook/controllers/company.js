// Methods bx24
import * as m from './company-methods-bx24.js';


// 
// export const companyList = (fields) => m.crmCompanyList(fields);



// const mockFields = {
//   "TITLE": `Тест_ Симонько Ирина Семёновна`, // Название компании
//   "ORIGIN_ID": "12",
//   "CREATED_BY_ID": CONSTS.CREATED_BY_ID,     // Кто создал 1 - Корзан Вячеслав
//   "ASSIGNED_BY_ID": CONSTS.ASSIGNED_BY_ID,   // Назначенный ответственный
//   "PHONE": [{ "VALUE": "+79501197000" }],
//   "EMAIL": [{ "VALUE": "korzan.va@mail.ru" }],
// };
  
export const companyAdd = (fields) => m.crmCompanyAdd(fields);


// Получаем данные компании
export const companyGet = (companyId) => m.crmCompanyGet(companyId);


// Delete company by Id
export const companyDelete = (companyId) => m.crmCompanyDelete(companyId);


/**
 * Возвращает набор полей для контакта компании
 */
export const companyContactFields = () => m.crmCompanyContactFields();
// if (res) console.log(`Существующие поля контакта: `, res);
// else console.log(`Ошибка при получении полей контакта: `, fields.TITLE);


// Добавляем контакт к компании
export const companyContactAdd = (companyId, fields) => m.crmCompanyContactAdd(companyId, fields);
