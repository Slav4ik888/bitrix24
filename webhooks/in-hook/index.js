// Methods
import { crmCompanyGet, crmCompanyAdd } from './controllers/methods.js';
// Functions
import { displayListHTML } from './lib/display.js';
// Consts
import { HOOK_QUERIES, CONSTS } from './consts.js';
import hookListArr from './lib/hooks.js';



console.log(`INIT START`);
const hooksContainer = document.querySelector(`.hooks-container`);
const hooksList = document.querySelector(`.hooks-list`);

const spinnerContainer = document.querySelector(`.spinner-container`);
const spinner = document.querySelector(`.spinner`);
const spinnerText = document.querySelector(`.spinner-text`);

const errorContainer = document.querySelector(`.error-container`);
const errorCloseIcon = document.querySelector(`.error-close-icon`);
const errorContent = document.querySelector(`.error-content`);
      
const resultContainer = document.querySelector(`.result-container`);
const resultCounter = document.querySelector(`.result-counter`);
const resultListContainer = document.querySelector(`.result-list-container`);







// Выводим список хуков
displayListHTML(hooksContainer, hooksList, hookListArr);

const hookList = document.querySelectorAll(`.hook-toggle-icon`);
console.log('hookList: ', hookList);


// В данный момент открытый контент Хука
let openedHookContent = null;

const toggleHook = (e) => {
  const target = e.target.closest(`li`);
  if (!target) return;
  if (!hooksList.contains(target)) return; // Если внутри li ещё будут вложенные ul.li то убеждаемся что именно наш target

  const currentContent = target.querySelector(`.hook-item-content`);

  if (openedHookContent) {
    if (openedHookContent === currentContent) {
      currentContent.classList.add(`hide`);
      openedHookContent = null;
    }
    else {
      openedHookContent.classList.add(`hide`);
      currentContent.classList.remove(`hide`);
      openedHookContent = currentContent;
    }
  }
  else {
    currentContent.classList.remove(`hide`);
    openedHookContent = currentContent;
  }
};

hooksList.addEventListener(`click`, toggleHook);


const companyId = document.querySelector(`.company-id`);
const hookSubmit = document.querySelector(`.hook-submit`);

const getCompanyById = (e) => {
  e.preventDefault();
  const value = companyId.value;
  console.log('value: ', value);

  crmCompanyGet(value);
};

const addCompany = (e) => {
  e.preventDefault();
  
  const fields = {
    "TITLE": `Тест_ Иванько Семён Семёныч`, // Название компании
    "ORIGIN_ID": "10",
    "CREATED_BY_ID": CONSTS.CREATED_BY_ID, // Кто создал 1 - Корзан Вячеслав
    "ASSIGNED_BY_ID": CONSTS.ASSIGNED_BY_ID, // Назначенный ответственный
    "PHONE": [{ "VALUE": "+79501197000" }],
    "EMAIL": [{ "VALUE": "korzan.va@mail.ru" }],
  }
  crmCompanyAdd(fields);
}

hookSubmit.addEventListener(`click`, getCompanyById);
// crmCompanyGet(4395);


// const mocks = require('../mocks');
// createOneBatch(`crm.company.add`, mocks.commands);

// createItemByFields(`crm.company.add`, mocks.fieldForCompany);
// createItemByFields(`crm.lead.add`, mocks.fieldForLead);

// Получаем данные по компании по ORIGIN_ID
// getCompanyDataByOriginId("15")

// Создаём новую компанию в Bitrix24 а если она есть то обновляем
// crmCompanyAddOrUpdate("22", mocks.fieldsUpdate);

// git add . && git commit -m "Начал писать приложение In-Hook" && git push origin master