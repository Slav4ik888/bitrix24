import { HOOK_URL, HOOK_QUERIES } from '../consts.js';



/**
 * Добавляет новую компанию
 * @param {*} fields 
 * @returns companyId | undefined;
 */
export async function crmCompanyAdd(fields) {
  try {
    const params = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ fields }) // Подготовленные поля
    };

    const response = await fetch(`${HOOK_URL}/crm.company.add.json`, params);
    const companyData = await response.json();
    console.log('crmCompanyAdd: ', companyData.result); // Возвращает созданный ID

    return companyData.result;
  }
  catch (e) {
    console.log('e: ', e);
    console.error(e);
    return;
  }
}




/**
 * Получаем данные по компании по id
 * 
 * @param {number} id 
 * @returns {companyData}
 */
export async function crmCompanyGet(id) {
  try {
    const params = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ id }) // company ID
    };

    const response = await fetch(`${HOOK_URL}/crm.company.get.json`, params);
    const companyData = await response.json();

    return companyData;
  }
  catch (e) { 
    console.log('e: ', e);
    console.error(e);
    return;
  }
}

/**
 * Delete company by Id
 * 
 * @param {number} id 
 * @returns {companyData}
 */
export async function crmCompanyDelete(id) {
  try {
    const params = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ id }) // company ID
    };

    const response = await fetch(`${HOOK_URL}/crm.company.delete.json`, params);
    const companyData = await response.json();
    console.log('crmCompanyDelete: ', companyData.result);

    return companyData.result;
  }
  catch (e) {
    console.log('e: ', e);
    console.error(e);
    return;
  }
}



// crm.company.contact.fields
// Добавляет контакт к компании данные по компании по id
export async function crmCompanyContactAdd(id, fields) {
  try {
    const params = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ id, fields })
    };

    const response = await fetch(`${HOOK_URL}/crm.company.contact.add.json`, params);
    const companyData = await response.json();
    console.log('companyData: ', companyData);
  }
  catch (e) {
    console.log('e: ', e);
    console.error(e);
  }
}


// async function createItemByFields(method, fields) {
//   try {
//     await axios.post(`${HOOK_URL}/${method}.json`, { fields });
//     console.log(method, `return Ok!`);

//   } catch (e) {
//     console.log('e: ', e.response.data);
//   }
// }


// TITLE "Онот_Лобыкина Ольга Александровна"

/**
 * Получаем список компаний по запрошенным данным
 * @param {Object} params { order: { "DATE_CREATE": "ASC" }, filter: { "OPENED": "Y" }, select: ["ID", "TITLE"] }
 * @returns {Array} 
 */
// async function crmCompanyList(params) {
//   try {
//     let result = await axios.post(`${HOOK_URL}/crm.company.list.json`, params);
//     console.log(result.data.result);

//     return result.data.result;

//   } catch (e) {
//     // console.log('e: ', e);
//     console.log('e: crmCompanyList', e.response.data);
//   }
// }


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


// async function hookStr(method, str) {
//   try {
//     console.log(`${HOOK_URL}/${method}.json?` + str);

//     const res = await axios.get(`${HOOK_URL}/${method}.json?` + str);

//     console.log(method, `return Ok!`);

//   } catch (e) {
//     console.log('e: ', e.data());
//   }
// }