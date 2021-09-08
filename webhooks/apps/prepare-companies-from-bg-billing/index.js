import { finalReport } from './libs/final-report/final-report.js';
import { saveBGCompanies, saveBGPersons, saveBX24Persons } from './libs/files/save-file/save-file.js';
import { findConsilience, getRemainderArr } from './libs/find-consilience/find-consilience.js';


// ******************************************** //
//                   SETTINGS                   //
// ******************************************** //

const NEED_SAVE_TO_FILE = true;  // Нужно ли сохранять в файл


// ******************************************** //
//         PROCESSING DATA FROM BILLING         //
// ******************************************** //

import { countersBG, DB_BG_PERSONS, dbCompanies, dbInvalidClients } from './controllers/bg/index.js';

// Счётчики для итоговой таблицы
const counters = Object.assign({}, countersBG);


// ******************************************** //
//           PROCESSING DATA FROM BX24          //
// ******************************************** //

import { DATA_FROM_BITRIX24 } from './controllers/bx24/index.js';
counters.dbBXL = DATA_FROM_BITRIX24.length;


// ******************************************** //
//   ОБНОВЛЯЕМ КОМПАНИИ ИЗ BX24 ДАННЫМИ ИЗ BG   //
// ******************************************** //


// Совпадение по населённому пункту и по ФИО
const { DB_BX_UPDATED, DB_BX_REMAINDER } = findConsilience(DATA_FROM_BITRIX24, DB_BG_PERSONS);
counters.dbBXUpdatedL = DB_BX_UPDATED.length;
counters.dbBXRemainderL = DB_BX_REMAINDER.length;
// console.log('DB_BX_REMAINDER: ', DB_BX_REMAINDER);


// ********************************************************* //
//    УБИРАЕМ ИЗ СПИСКА BG КОМПАНИИ КОТОРЫЕ ЕСТЬ В BX24      //
// ********************************************************* //


const DB_BG_FINAL = getRemainderArr(DB_BX_UPDATED, DB_BG_PERSONS, `ORIGIN_ID`);
counters.dbBGFinalL = DB_BG_FINAL.length;


// ******************************************** //
//            СОХРАНЯЕМ В ФАЙЛЫ JSON            //
// ******************************************** //


if (NEED_SAVE_TO_FILE) {
  saveBGCompanies(dbCompanies);
  saveBGPersons(DB_BG_FINAL);
  saveBX24Persons(DB_BX_UPDATED); // 
};


// ******************************************** //
//                     ОТЧЁТ                    //
// ******************************************** //


finalReport(counters);



// git add . && git commit -m "19-07-2021" && git push origin master