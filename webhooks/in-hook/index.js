// Functions
import { displayListHTML } from './lib/display/display.js';
import toggleHook from './lib/creates/create-toggle-hook/create-toggle-hook.js';
// Consts
import hooksListArr from './lib/creates/create-hooks-list/create-hooks-list.js';


// INITIALIZE
const hooksContainer = document.querySelector(`.hooks-container`);
const hooksList = document.querySelector(`.hooks-list`);


hooksList.addEventListener(`click`, (e) => toggleHook(e.target));

// Выводим список хуков
displayListHTML(hooksContainer, hooksList, hooksListArr);





// const companyId = document.querySelector(`.company-id`);
// const hookSubmit = document.querySelector(`.hook-submit`);

// hookSubmit.addEventListener(`submit`, (e) => {
//   e.preventDefault();
//   submit();
// });
// crmCompanyGet(4395);


// const mocks = require('../mocks');
// createOneBatch(`crm.company.add`, mocks.commands);

// createItemByFields(`crm.company.add`, mocks.fieldForCompany);
// createItemByFields(`crm.lead.add`, mocks.fieldForLead);

// Получаем данные по компании по ORIGIN_ID
// getCompanyDataByOriginId("15")

// Создаём новую компанию в Bitrix24 а если она есть то обновляем
// crmCompanyAddOrUpdate("22", mocks.fieldsUpdate);

// git add . && git commit -m "end refact update from bg" && git push origin master