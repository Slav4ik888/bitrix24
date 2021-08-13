import { HOOK_URL } from '../consts/consts.js';



/**
 * Получает существующий набор полей для контакта
 * 
 * @returns contactFields
 */
export async function crmCompanyContactFields() {
  try {
    const response = await fetch(`${HOOK_URL}/crm.company.contact.fields.json`);
    const data = await response.json();
    // console.log('crmCompanyContactFields: ', data.result); // Возвращает созданный ID

    return data.result;
  }
  catch (e) {
    console.log('e: ', e);
    console.error(e);
    return;
  }
}


/**
 * Добавляет новый контакт
 * 
 * @param {*} fields 
 * @returns contactId | undefined;
 */
export async function crmContactAdd(fields) {
  try {
    const params = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ fields }) // Подготовленные поля
    };
    const response = await fetch(`${HOOK_URL}/crm.contact.add.json`, params);
    const contactData = await response.json();
    console.log('crmContactAdd: ', contactData.result); // Возвращает созданный ID

    return contactData.result;
  }
  catch (e) {
    console.log('e: ', e);
    console.error(e);
    return;
  }
}

