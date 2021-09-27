// Methods bx24
import * as m from './contact-methods-bx24.js';



// Возвращает набор полей multifield полей
export const multifieldFields = () => m.crmMultifieldFields();

// Возвращает набор полей для контакта
export const contactFields = () => m.crmContactFields();



// Получаем данные компании
export const contactGet = (contactId) => m.crmContactGet(contactId);



// const fields = {
//   "ADDRESS" : address;
//   "NAME" : NAME;
//   "LAST_NAME" : LAST_NAME;
//   "SECOND_NAME" : SECOND_NAME

//   "CREATED_BY_ID": CONSTS.CREATED_BY_ID, // Кто создал 1 - Корзан Вячеслав
//   "ASSIGNED_BY_ID": CONSTS.ASSIGNED_BY_ID, // Назначенный ответственный
//   "PHONE": [{ "VALUE": "+79501197000" || null }],
// }
export const contactAdd = (fields) => m.crmContactAdd(fields);

export const contactDelete = (contactId) => m.crmContactDelete(contactId);