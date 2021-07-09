import { getListFromJSON } from './libs/files/get-list-from-json/get-list-from-json.js';
import { finalReport } from './libs/final-report/final-report.js';
import { prepareClientsData } from './libs/prepared-clients-data/prepared-clients-data.js';
import { saveCompanies, savePersons, savePersonAddressList } from './libs/files/save-file/save-file.js';
import { getSortedCompanyTitleList, getSetCompanyTitleList, getSetAddressList } from './libs/get-lists/get-lists.js';


// SETTINGS
const LIMIT_CLIENTS = false;      // Лимит компаний для тестирования
const NEED_SAVE_TO_FILE = true;  // Нужно ли сохранять в файл

const DB_CLIENTS = './data/Result_06_28.json';

// WORK DATA
const DATA_CLIENTS = getListFromJSON(DB_CLIENTS);



const { counts, dbPersons, dbCompanies, dbInvalidClients } = prepareClientsData(DATA_CLIENTS, LIMIT_CLIENTS);

if (NEED_SAVE_TO_FILE) {
  saveCompanies(dbCompanies);
  savePersons(dbPersons);
};

finalReport(DATA_CLIENTS.length, counts);

// Вывести список названий компаний dbCompanies
// const sortedCompanies = getSortedCompanyTitleList(dbCompanies);

// Вывести уникальные
// const setCompanies = getSetCompanyTitleList(dbCompanies);
// console.log('Companies: ', setCompanies);

// Вывести список названий компаний dbPersons
// const sortedPersons = getSortedCompanyTitleList(dbPersons);
// savePersonAddressList(sortedPersons);
// console.log('sortedPersons: ', sortedPersons);

// Вывести уникальные
// const setPersons = getSetCompanyTitleList(dbPersons);
// console.log('Persons: ', setPersons);

// Только населённые пункты (отсортированные)
const companiesAddressList = getSetAddressList(dbCompanies);

const personsAddressList = getSetAddressList(dbPersons);
personsAddressList.forEach(item => console.log(item));
