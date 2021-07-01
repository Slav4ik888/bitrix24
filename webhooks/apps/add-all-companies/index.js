import { getListFromJSON } from './libs/files/get-list-from-json/get-list-from-json.js';
import { finalReport } from './libs/final-report/final-report.js';
import { prepareClientsData } from './libs/prepared-clients-data/prepared-clients-data.js';
import { saveCompanies, savePersons } from './libs/files/save-file/save-file.js';
import { getSortedCompanyTitleList, getSetCompanyTitleList } from './libs/get-lists/get-lists.js';


const DB_CLIENTS = './data/Result_06_28.json';

// WORK DATA
const DATA_CLIENTS = getListFromJSON(DB_CLIENTS);

// TEST SETTINGS
// Лимит компаний для тестирования
const LIMIT_CLIENTS = 50;
const NEED_SAVE_TO_FILE = false;

const { counts, dbPersons, dbCompanies, dbInvalidClients } = prepareClientsData(DATA_CLIENTS, LIMIT_CLIENTS);

if (NEED_SAVE_TO_FILE) {
  saveCompanies(dbCompanies);
  savePersons(dbPersons);
};

finalReport(DATA_CLIENTS.length, counts);

// Вывести список названий компаний dbPersons
// Вывести список названий компаний dbCompanies
//  - сортированны
const sortedCompanies = getSortedCompanyTitleList(dbCompanies);
const setCompanies = getSetCompanyTitleList(dbCompanies);

console.log('Companies: ', setCompanies);

const sortedPersons = getSortedCompanyTitleList(dbPersons);
const setPersons = getSetCompanyTitleList(dbPersons);
console.log('Persons: ', setPersons);

//  - затем только населённые пункты


