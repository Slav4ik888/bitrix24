const getAllCompanies = require('./tasks/get-all-companies');

// Получаем все компании и сохраняем их в файл
getAllCompanies();


// const mocks = require('../mocks');
// createOneBatch(`crm.company.add`, mocks.commands);

// createItemByFields(`crm.company.add`, mocks.fieldForCompany);
// createItemByFields(`crm.lead.add`, mocks.fieldForLead);

// Получаем данные по компании по ORIGIN_ID
// getCompanyDataByOriginId("15")

// Создаём новую компанию в Bitrix24 а если она есть то обновляем
// crmCompanyAddOrUpdate("22", mocks.fieldsUpdate);
