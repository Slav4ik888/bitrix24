import { HOOK_URL, paramsPOST } from '../consts/consts.js';


// Возвращает список полей компании
export async function companyFields(params) {
  try {
    paramsPOST.body = JSON.stringify(params);

    const response = await fetch(`${HOOK_URL}/crm.company.fields.json`, paramsPOST);
    const companyData = await response.json();

    return companyData.result;
  }
  catch (e) { console.log('e: ', e); console.error(e); return }
};



/**
 * Запрашиваем и получаем список компаний по запрошенным данным (например ORIGIN_ID)
 * 
 * @param {Object} params { order: { "DATE_CREATE": "ASC" }, filter: { "OPENED": "Y" }, select: ["ID", "TITLE"] }
 * @returns {Array} 
 */
export async function companyList(params) {
  try {
    paramsPOST.body = JSON.stringify(params);

    const response = await fetch(`${HOOK_URL}/crm.company.list.json`, paramsPOST);
    const companyData = await response.json();

    return companyData.result;
  }
  catch (e) { console.log('e: ', e); console.error(e); return }
}



/**
 * Добавляет новую компанию
 * @param {*} fields 
 * @returns companyId | undefined;
 */
export async function crmCompanyAdd(fields) {
  try {
    paramsPOST.body = JSON.stringify({ fields }); // Подготовленные поля

    const response = await fetch(`${HOOK_URL}/crm.company.add.json`, paramsPOST);
    const companyData = await response.json();

    return companyData.result; // Возвращает созданный ID
  }
  catch (e) { console.log('e: ', e); console.error(e); return }
}



/**
 * Получаем данные по компании по id
 * 
 * @param {number} id 
 * @returns {companyData}
 */
export async function crmCompanyGet(id) {
  try {
    paramsPOST.body = JSON.stringify({ id }); // company ID

    const response = await fetch(`${HOOK_URL}/crm.company.get.json`, paramsPOST);
    const companyData = await response.json();

    return companyData;
  }
  catch (e) { console.log('e: ', e); console.error(e); return }
}


/**
 * Обновляем данные компании
 * @param {number} id 
 * @param {*} fields 
 * @returns boolean
 */
export async function companyUpdate(id, fields) {
  try {
    paramsPOST.body = JSON.stringify({ id, fields }); // Подготовленные поля

    const response = await fetch(`${HOOK_URL}/crm.company.update.json`, paramsPOST);
    const companyData = await response.json();

    return companyData.result;
  }
  catch (e) { console.log('e: ', e); console.error(e); return }
}


/**
 * Delete company by Id
 * 
 * @param {number} id 
 * @returns {companyData}
 */
export async function crmCompanyDelete(id) {
  try {
    paramsPOST.body = JSON.stringify({ id }); // company ID

    const response = await fetch(`${HOOK_URL}/crm.company.delete.json`, paramsPOST);
    const companyData = await response.json();

    return companyData.result;
  }
  catch (e) { console.log('e: ', e); console.error(e); return }
}



// crm.company.contact.fields
// Добавляет контакт к компании данные по компании по id
export async function crmCompanyContactAdd(id, fields) {
  try {
    paramsPOST.body = JSON.stringify({ id, fields });

    const response = await fetch(`${HOOK_URL}/crm.company.contact.add.json`, paramsPOST);
    const companyData = await response.json();
    
    return companyData;
  }
  catch (e) { console.log('e: ', e); console.error(e); return}
}


// async function createItemByFields(method, fields) {
//   try {
//     await axios.post(`${HOOK_URL}/${method}.json`, { fields });
//     console.log(method, `return Ok!`);

//   } catch (e) {
//     console.log('e: ', e.response.data);
//   }
// }


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
  catch (e) { console.log('e: ', e); console.error(e); return; }
}


/**
 * Возвращает данные по компании по ORIGIN_ID, а если нет то {}
 * @param {String} originId 
 * @returns {Object} 
 */
// async function getCompanyDataByOriginId(originId) {
//   try {
//     const result = await axios.post(`${HOOK_URL}/crm.company.list.json`, {
//       filter: { "ORIGIN_ID": originId },
//       select: [ "ID", "TITLE", "ORIGIN_ID", "CREATED_BY_ID" ],
//     });

//     if (result.data.total) {
//       console.log(`crm.company.get - Компания с ORIGIN_ID ${originId} найдена!`);
//       return result.data.result[0];
//     }
    
//     console.log(`crm.company.get - Компания с ORIGIN_ID ${originId} не найдена...`);
//     return {};

//   } catch (e) {
//     console.log('e: ', e.response.data);
//   }
// }

// Обновляем данные по компании
// async function crmCompanyAddOrUpdate(originId, fields) {
//   try {
//     const result = await getCompanyDataByOriginId(originId);
//     console.log('result getCompanyDataByOriginId: ', result);

//     if (result.hasOwnProperty(`ID`)) {
//       console.log(`update`);
//       await axios.post(`${HOOK_URL}/crm.company.update.json`, {
//         id: result.ID,
//         fields,
//         params: { "REGISTER_SONET_EVENT": "Y" }
//       });
//     } else {
//       console.log('mocks.fieldForCompany: ', mocks.fieldForCompany);
//       mocks.fieldForCompany.ORIGIN_ID = originId;
//       await axios.post(`${HOOK_URL}/crm.company.add.json`, { fields: mocks.fieldForCompany });
      
//     }

//   } catch (e) {
//     console.log('e: ', e.response?.data);
//   }
// }


// Возвращает список пользовательских полей компании
export async function crmCompanyUserfields() {
  try {
    // paramsPOST.body = JSON.stringify();

    const response = await fetch(`${HOOK_URL}/crm.userfield.fields.json`);
    const companyData = await response.json();

    return companyData.result;
  }
  catch (e) { console.log('e: ', e); console.error(e); return }
};



// crm.company.userfield.add
// Создаёт пользовательское поле для компании
export async function crmCompanyUserFieldsAdd(fields) {
  console.log('fields: ', fields);

  try {
    paramsPOST.body = JSON.stringify({ fields });
    console.log('paramsPOST.body: ', paramsPOST.body);

    const response = await fetch(`${HOOK_URL}/crm.company.userfield.add.json`, paramsPOST);
    const companyData = await response.json();
    
    return companyData;
  }
  catch (e) { console.log('e: ', e); console.error(e); return}
}