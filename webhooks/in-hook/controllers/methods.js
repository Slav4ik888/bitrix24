const axios = require('axios');
const { HOOK_URL } = require('../consts');
const mocks = require('../mocks');

  
async function createItemByFields(method, fields) {
  try {
    await axios.post(`${HOOK_URL}/${method}.json`, { fields });
    console.log(method, `return Ok!`);

  } catch (e) {
    console.log('e: ', e.response.data);
  }
};

// Получаем данные по компании по id
async function crmCompanyGet(id) {
  try {
    const result = await axios.post(`${HOOK_URL}/crm.company.get.json`, { id }); // ORIGIN_ID: id
    console.log('res: ', result.data);
    
    console.log(`crm.company.get - return Ok!`);

  } catch (e) {
    // console.log('e: ', e);
    console.log('e: ', e.response.data);
  }
};


// TITLE "Онот_Лобыкина Ольга Александровна"

/**
 * Получаем список компаний по запрошенным данным
 * @param {Object} params { order: { "DATE_CREATE": "ASC" }, filter: { "OPENED": "Y" }, select: ["ID", "TITLE"] }
 * @returns {Array} 
 */
async function crmCompanyList(params) {
  try {
    let result = await axios.post(`${HOOK_URL}/crm.company.list.json`, params);
    console.log(result);

    return result.data.result;

  } catch (e) {
    // console.log('e: ', e);
    console.log('e: crmCompanyList', e.response.data);
  }
};


/**
 * Возвращает данные по компании по ORIGIN_ID, а если нет то {}
 * @param {String} originId 
 * @returns {Object} 
 */
async function getCompanyDataByOriginId(originId) {
  try {
    const result = await axios.post(`${HOOK_URL}/crm.company.list.json`, {
      filter: { "ORIGIN_ID": originId },
      select: [ "ID", "TITLE", "ORIGIN_ID", "CREATED_BY_ID" ],
    });

    if (result.data.total) {
      console.log(`crm.company.get - Компания с ORIGIN_ID ${originId} найдена!`);
      return result.data.result[0];
    }
    
    console.log(`crm.company.get - Компания с ORIGIN_ID ${originId} не найдена...`);
    return {};

  } catch (e) {
    console.log('e: ', e.response.data);
  }
};

// Обновляем данные по компании
async function crmCompanyAddOrUpdate(originId, fields) {
  try {
    const result = await getCompanyDataByOriginId(originId);
    console.log('result getCompanyDataByOriginId: ', result);

    if (result.hasOwnProperty(`ID`)) {
      console.log(`update`);
      await axios.post(`${HOOK_URL}/crm.company.update.json`, {
        id: result.ID,
        fields,
        params: { "REGISTER_SONET_EVENT": "Y" }
      });
    } else {
      console.log('mocks.fieldForCompany: ', mocks.fieldForCompany);
      mocks.fieldForCompany.ORIGIN_ID = originId;
      await axios.post(`${HOOK_URL}/crm.company.add.json`, { fields: mocks.fieldForCompany });
      
    }

  } catch (e) {
    console.log('e: ', e.response?.data);
  }
};


async function hookStr(method, str) {
  try {
    console.log(`${HOOK_URL}/${method}.json?` + str);

    const res = await axios.get(`${HOOK_URL}/${method}.json?` + str);

    console.log(method, `return Ok!`);

  } catch (e) {
    console.log('e: ', e.data());
  }
};
  
module.exports = {
  createItemByFields,
  crmCompanyGet,
  crmCompanyList,
  getCompanyDataByOriginId,
  crmCompanyAddOrUpdate,
  hookStr,
}