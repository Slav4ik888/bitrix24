// BX24
import { createReqList } from '../lib/creates/create-requests/create-req-list.js';
import { createBatches, sendAllBatches } from './batchs-hook.js';
// Helpers
import { getResultFromResBx24 } from '../lib/get-result-from-res-bx24/get-result-from-res-bx24.js';
import { showTimer } from '../utils/timer/timer.js';
import { objectLength } from '../utils/objects/objects.js';
// Data
import { setStorageData } from '../utils/data/local-storage.js';
// Types
import { getStorageResByMethod, getStorageIdsByMethod } from '../lib/get-storage-name-by-method/get-storage-name-by-method.js';


// Групповое обновление компаний | контактов
export async function groupUpdate(clearnedClients, method) {
  return new Promise(async function (resolve, reject) {
    try {
      // Создаём строки запроса по ORIGIN_ID
      const reqList = createReqList(clearnedClients, method);
  
      // Делим по пачкам 50шт
      const batches = createBatches(reqList, method);
      console.log('groupUpdate batches: ', batches);

      // Отправляем запрос
      const { result, timer } = await sendAllBatches(batches);

      console.log('UPDATED_RES: ', result);
      const storeName = getStorageResByMethod(method);
      setStorageData(storeName, result);
      // showTimer(timer.calls);

  
      const listCompanyIds = getResultFromResBx24(result);
      setStorageData(getStorageIdsByMethod(method), listCompanyIds);
      console.log(`UPDATED: `, objectLength(listCompanyIds));
  
      return resolve(listCompanyIds);
    }
    catch (e) {
      console.log('e: ', e);
    }
  })
}