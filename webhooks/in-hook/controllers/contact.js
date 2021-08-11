// Methods bx24
import * as m from './contact-methods-bx24.js';


/**
 * Возвращает набор полей для контакта компании
 */
export const companyContactFields = async () => await m.crmCompanyContactFields();
// if (res) console.log(`Существующие поля контакта: `, res);
// else console.log(`Ошибка при получении полей контакта: `, fields.TITLE);



export const contactAdd = async (e) => {
  e.preventDefault();
  
  const fields = {
    "TITLE": `Симонько Ирина Семёновна`, // Название компании
    "ORIGIN_ID": "12",
    "CREATED_BY_ID": CONSTS.CREATED_BY_ID, // Кто создал 1 - Корзан Вячеслав
    "ASSIGNED_BY_ID": CONSTS.ASSIGNED_BY_ID, // Назначенный ответственный
    "PHONE": [{ "VALUE": "+79501197000" }],
    "EMAIL": [{ "VALUE": "korzan.va@mail.ru" }],
  }
  const res = await m.crmContactAdd(fields);

  if (res) console.log(`Id нового контакта: `, res);
  else console.log(`Ошибка при создании контакта: `, fields.TITLE);
};