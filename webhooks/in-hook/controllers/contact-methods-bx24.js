import { HOOK_URL, paramsPOST } from '../consts/consts.js';



/**
 * Получает существующий набор полей для multifield
 * 
 * @returns multifieldFields
 */
export async function crmMultifieldFields() {
  try {
    const response = await fetch(`${HOOK_URL}/crm.multifield.fields.json`);
    const data = await response.json();
    console.log('data: ', data);

    return data.result;
  }
  catch (e) { console.log('e: ', e); console.error(e); return; }
}



/**
 * Получает существующий набор полей для контакта
 * 
 * @returns contactFields
 */
export async function crmContactFields() {
  try {
    const response = await fetch(`${HOOK_URL}/crm.contact.fields.json`);
    const data = await response.json();

    return data.result;
  }
  catch (e) { console.log('e: ', e); console.error(e); return; }
}



/**
 * Получаем данные по контакту по id
 * 
 * @param {number} id 
 * @returns {contactData}
 */
export async function crmContactGet(id) {
  try {
    paramsPOST.body = JSON.stringify({ id }); // contact ID

    const response = await fetch(`${HOOK_URL}/crm.contact.get.json`, paramsPOST);
    const contactData = await response.json();

    return contactData;
  }
  catch (e) { console.log('e: ', e); console.error(e); return }
}


/**
 * Добавляет новый контакт
 * 
 * @param {*} fields 
 * @returns contactId | undefined;
 */
export async function crmContactAdd(fields) {
  console.log('fields: ', fields);
  try {
    paramsPOST.body = JSON.stringify({ fields }); // Подготовленные поля

    const response = await fetch(`${HOOK_URL}/crm.contact.add.json`, paramsPOST);
    const contactData = await response.json();

    return contactData.result;
  }
  catch (e) { console.log('e: ', e); console.error(e); return }
}


/**
 * Delete contact by Id
 * 
 * @param {number} id 
 * @returns {contactData}
 */
export async function crmContactDelete(id) {
  try {
    paramsPOST.body = JSON.stringify({ id }); // contact ID

    const response = await fetch(`${HOOK_URL}/crm.contact.delete.json`, paramsPOST);
    const contactData = await response.json();

    return contactData.result;
  }
  catch (e) { console.log('e: ', e); console.error(e); return }
}