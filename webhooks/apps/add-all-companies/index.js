import { getListFromJSON } from './libs/files/get-list-from-json/get-list-from-json.js';
import { finalReport } from './libs/final-report/final-report.js';
import { prepareClientsData } from './libs/prepared-clients-data/prepared-clients-data.js';
import { saveCompanies, savePersons, savePersonAddressList } from './libs/files/save-file/save-file.js';
import { getSortedCompanyTitleList, getSetCompanyTitleList, getSetAddressList } from './libs/get-lists/get-lists.js';
import { filterArrByFieldAndRegexp } from './libs/filters/filter-arr-by-field-and-regexp/filter-arr-by-field-and-regexp.js';
import { findConsilience } from './libs/find-consilience/find-consilience.js';
import { sortingArr } from './utils/sorting/sorting-arr.js';
import { getDB24WithoutTrashlist } from './libs/clean-db-from-bitrix24/clean-db-from-bitrix24.js';



// SETTINGS
const LIMIT_CLIENTS = false;      // Лимит компаний для тестирования
const NEED_SAVE_TO_FILE = false;  // Нужно ли сохранять в файл

// WORK DATA FROM BILLING
const bg0 = './data/Result_06_28.json';
const DATA_FROM_BG = getListFromJSON(bg0);

// WORK DATA FROM BITRIX24
const bx0 = './data/companies-from-bitrix24.json';
const bx1 = getListFromJSON(bx0);
const bx2 = getDB24WithoutTrashlist(bx1);
const bx3 = filterArrByFieldAndRegexp(bx2, `TITLE`, /_/); // Отбираем только те что со знаком "_"
const DATA_FROM_BITRIX24 = sortingArr(bx3, `TITLE`); // Cортируем по TITLE



const { counts, dbPersons, dbCompanies, dbInvalidClients } = prepareClientsData(DATA_FROM_BG, LIMIT_CLIENTS);

if (NEED_SAVE_TO_FILE) {
  saveCompanies(dbCompanies);
  savePersons(dbPersons);
};

counts.dbBGL = DATA_FROM_BG.length;
counts.dbBXL = DATA_FROM_BITRIX24.length;


// BG Вывести список названий компаний dbCompanies
// const sortedCompanies = getSortedCompanyTitleList(dbCompanies);

// BG Вывести уникальные
// const setCompanies = getSetCompanyTitleList(dbCompanies);
// console.log('Companies: ', setCompanies);

// BG Вывести список названий компаний dbPersons
// const sortedPersons = getSortedCompanyTitleList(dbPersons);
// savePersonAddressList(sortedPersons);
// console.log('sortedPersons: ', sortedPersons);

// BG Вывести уникальные
// const setPersons = getSetCompanyTitleList(dbPersons);
// console.log('Persons: ', setPersons);

// BG Только населённые пункты (отсортированные)
const companiesAddressList = getSetAddressList(dbCompanies);
const personsAddressList = getSetAddressList(dbPersons);
personsAddressList.forEach(item => console.log(item));



// Совпадение по населённому пункту
// Совпадение по ФИО
const { DB_BX_UPDATED, DB_BX_REMAINDER } = findConsilience(DATA_FROM_BITRIX24, dbPersons);
console.log('DB_BX_REMAINDER: ', DB_BX_REMAINDER);
counts.dbBXUpdatedL = DB_BX_UPDATED.length;
counts.dbBXRemainderL = DB_BX_REMAINDER.length;
finalReport(counts);

// TODO: показать те что не обновлены в Битрикс

// git add . && git commit -m "15-07-2021" && git push origin master