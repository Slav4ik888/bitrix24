const { crmCompanyAddOrUpdate, crmCompanyList } = require('./methods/methods');
const mocks = require('./mocks');


const url1 = "TITLE=Test%20lead%20by%20robot%20naaaahhhh&CREATED_BY_ID=1&ASSIGNED_BY_ID=1&PHONE=%5Bobject%20Object%5D&EMAIL=%5Bobject%20Object%5D&COMMENTS=%D0%9A%D0%B0%D0%BA%D0%BE%D0%B9-%D1%82%D0%BE%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B9%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D1%8B%20%D0%B4%D0%B5%D0%BB%D0%B0!";
const url2 = "fields[TITLE]=Test%20lead%20by%20robot%20naaaahhhh&fields[CREATED_BY_ID]=2";



    
// createOneBatch(`crm.company.add`, mocks.commands);



// createItemByFields(`crm.company.add`, mocks.fieldForCompany);
// createItemByFields(`crm.lead.add`, mocks.fieldForLead);

// Получаем данные по компании по ORIGIN_ID
// getCompanyDataByOriginId("15")

// Создаём новую компанию в Bitrix24 а если она есть то обновляем
crmCompanyAddOrUpdate("21", mocks.fieldsUpdate);
crmCompanyList();









