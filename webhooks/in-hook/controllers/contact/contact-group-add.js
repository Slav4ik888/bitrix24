// BX24
import { createReqList } from '../../lib/creates/create-requests/create-req-list.js';
import { createBatches, sendAllBatches } from '../batchs-hook.js';
// Helpers
import { showTimer } from '../../utils/timer/timer.js';
import { getResultFromResBx24 } from '../../lib/get-result-from-res-bx24/get-result-from-res-bx24.js';
import { objectLength } from '../../utils/objects/objects.js';
// Data
import { setStorageData } from '../../utils/data/local-storage.js';
// Types
import { StorageName, MethodType } from '../../types.js';



// Групповое добавление контактов
export async function contactGroupAdd(clearnedClients) {
  return new Promise(async function (resolve, reject) {
    try {
      if (!clearnedClients.length) {
        console.log(`Нет контактов для создания...`);
        return resolve([]);
      }
      
      console.log(`CREATE CONTACTS: `, clearnedClients);

      // Создаём строки запроса по ORIGIN_ID
      const reqList = createReqList(clearnedClients, MethodType.CONTACT_ADD);
  
      // Делим по пачкам 50шт
      const batches = createBatches(reqList, MethodType.CONTACT_ADD);
      console.log('contactGroupAdd batches: ', batches);


      // Отправляем запрос
      const { result, timer } = await sendAllBatches(batches);
      console.log('ADDED_CONTACTS_RES: ', result);
      
      // Обработка полученных результатов
      setStorageData(StorageName.ADDED_CONTACTS_RES, result);
      // showTimer(timer.calls);

      const listContactIds = getResultFromResBx24(result);
      setStorageData(StorageName.ADDED_CONTACTS_IDS, listContactIds);
      console.log(`ADDED: `, objectLength(listContactIds));
    

      return resolve({ clearnedClients, listContactIds });
    }
    catch (e) {
      console.log('e: ', e);
    }
  })
}
