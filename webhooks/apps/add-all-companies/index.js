import { finalReport } from './libs/final-report/final-report.js';
import { saveCompanies, savePersons } from './libs/files/save-file/save-file.js';
import { findConsilience } from './libs/find-consilience/find-consilience.js';

// GET WORK DATA FROM BILLING
import { countersBG, dbPersons, dbCompanies, dbInvalidClients } from './controllers/bg/index.js';

// GET WORK DATA FROM BITRIX24
import { DATA_FROM_BITRIX24 } from './controllers/bx24/index.js';
import { sortingArr } from './utils/sorting/sorting-arr.js';
import { getItemFromArrByField } from './utils/arrays/get-item-from-arr-by-field/get-item-from-arr-by-field.js';


// SETTINGS
const NEED_SAVE_TO_FILE = false;  // Нужно ли сохранять в файл

if (NEED_SAVE_TO_FILE) {
  saveCompanies(dbCompanies);
  savePersons(dbPersons);
};

// Счётчики для итоговой таблицы
const counters = Object.assign({}, countersBG);
counters.dbBXL = DATA_FROM_BITRIX24.length;



// Совпадение по населённому пункту
// Совпадение по ФИО
const { DB_BX_UPDATED, DB_BX_REMAINDER } = findConsilience(DATA_FROM_BITRIX24, dbPersons);
counters.dbBXUpdatedL = DB_BX_UPDATED.length;
counters.dbBXRemainderL = DB_BX_REMAINDER.length;

console.log('DB_BX_REMAINDER: ', DB_BX_REMAINDER);


finalReport(counters);

// TODO: показать те что не обновлены в Битрикс

// git add . && git commit -m "19-07-2021" && git push origin master