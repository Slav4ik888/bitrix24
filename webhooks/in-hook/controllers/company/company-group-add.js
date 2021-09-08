// BX24
import { createReqList } from '../../lib/create-requests/create-req-list.js';
import { createBatches, sendAllBatches } from '../batchs-hook.js';
// Helpers
import { getResultFromResBx24 } from '../../lib/get-result-from-res-bx24/get-result-from-res-bx24.js';
import { showTimer } from '../../utils/timer/timer.js';
import { objectLength } from '../../utils/objects/objects.js';
// Data
import { setStorageData } from '../../utils/data/local-storage.js';
// Types
import { StorageName, MethodType } from '../../types.js';


// Групповое добавление компаний
export async function companyGroupAdd(clearnedClients, callback) {
  console.log(`Создаём компании: `, clearnedClients);

  // Создаём строки запроса по ORIGIN_ID
  const reqList = createReqList(clearnedClients, MethodType.COMPANY_ADD);
  
  // Делим по пачкам 50шт
  const batches = createBatches(reqList, MethodType.COMPANY_ADD);
  console.log('companyGroupAdd batches: ', batches);


  // Обработка полученных результатов
  const cbListResult = (res, timer) => {
    console.log('ADDED_COMPANIES_RES: ', res);
    setStorageData(StorageName.ADDED_COMPANIES_RES, res);
    showTimer(timer.calls);

    
    const listCompanyIds = getResultFromResBx24(res);
    setStorageData(StorageName.ADDED_COMPANIES_IDS, listCompanyIds);
    console.log('ADDED_COMPANIES_IDS: ', listCompanyIds);
    console.log(`length: `, objectLength(listCompanyIds));
    
    return callback(listCompanyIds);
  }

  // Отправляем запрос
  sendAllBatches(batches, cbListResult);
}