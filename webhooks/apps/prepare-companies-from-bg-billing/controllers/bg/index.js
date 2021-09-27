import { getListFromJSON } from '../../libs/files/get-list-from-json/get-list-from-json.js';

// WORK DATA FROM BILLING
const url = './data/from/data-21.09.21.json';
export const DATA_FROM_BG = getListFromJSON(url);



import { prepareClientsData } from '../../libs/bg/prepared-clients-data/prepared-clients-data.js';
import { getSortedCompanyTitleList, getSetCompanyTitleList, getSetAddressList } from '../../libs/get-lists/get-lists.js';

// Лимит компаний для тестирования
const LIMIT_CLIENTS = false; // 100;

export const { countersBG, DB_BG_PERSONS, dbCompanies, dbInvalidClients } = prepareClientsData(DATA_FROM_BG, LIMIT_CLIENTS);
// console.log('DB_BG_PERSONS: ', DB_BG_PERSONS);

// BG Вывести список названий компаний dbCompanies
// const sortedCompanies = getSortedCompanyTitleList(dbCompanies);

// BG Вывести уникальные
// const setCompanies = getSetCompanyTitleList(dbCompanies);
// console.log('Companies: ', setCompanies);

// BG Вывести список названий компаний DB_BG_PERSONS
// const sortedPersons = getSortedCompanyTitleList(DB_BG_PERSONS);
// savePersonAddressList(sortedPersons);
// console.log('sortedPersons: ', sortedPersons);

// BG Вывести уникальные
// const setPersons = getSetCompanyTitleList(DB_BG_PERSONS);
// console.log('Persons: ', setPersons);

// BG Только населённые пункты (отсортированные)
// const companiesAddressList = getSetAddressList(dbCompanies);
const personsAddressList = getSetAddressList(DB_BG_PERSONS);
// console.log('DB_BG_PERSONS: ', DB_BG_PERSONS);
personsAddressList.forEach(item => console.log(item));
console.log('personsAddressList: ', personsAddressList);

