import { getListFromJSON } from '../../libs/files/get-list-from-json/get-list-from-json.js';

// WORK DATA FROM BILLING
const url = './data/Result_06_28.json';
export const DATA_FROM_BG = getListFromJSON(url);



import { prepareClientsData } from '../../libs/bg/prepared-clients-data/prepared-clients-data.js';
import { getSortedCompanyTitleList, getSetCompanyTitleList, getSetAddressList } from '../../libs/get-lists/get-lists.js';

// Лимит компаний для тестирования
const LIMIT_CLIENTS = false;      

export const { countersBG, dbPersons, dbCompanies, dbInvalidClients } = prepareClientsData(DATA_FROM_BG, LIMIT_CLIENTS);

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

