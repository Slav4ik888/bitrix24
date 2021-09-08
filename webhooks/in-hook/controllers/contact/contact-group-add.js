// BX24
import { createReqList } from '../../lib/create-requests/create-req-list.js';
import { createBatches, sendAllBatches } from '../batchs-hook.js';
// Helpers
import { showTimer } from '../../utils/timer/timer.js';
import { getResultFromResBx24 } from '../../lib/get-result-from-res-bx24/get-result-from-res-bx24.js';
// Data
import { setStorageData } from '../../utils/data/local-storage.js';
// Types
import { StorageName, MethodType } from '../../types.js';



// Групповое добавление контактов
export async function contactGroupAdd(clearnedClients, callback) {
  console.log(`Создаём контакты: `, clearnedClients);

  // Создаём строки запроса по ORIGIN_ID
  const reqList = createReqList(clearnedClients, MethodType.CONTACT_ADD);
  
  // Делим по пачкам 50шт
  const batches = createBatches(reqList, MethodType.CONTACT_ADD);
  console.log('contactGroupAdd batches: ', batches);


  // Обработка полученных результатов
  const cbListResult = (res, timer) => {
    console.log('ADDED_CONTACTS_RES: ', res);
    setStorageData(StorageName.ADDED_CONTACTS_RES, res);
    showTimer(timer.calls);

    const listContactIds = getResultFromResBx24(res);
    setStorageData(StorageName.ADDED_CONTACTS_IDS, listContactIds);
    console.log('ADDED_CONTACTS_IDS: ', listContactIds);
    
    return callback(clearnedClients, listContactIds);
  }

  // Отправляем запрос
  sendAllBatches(batches, cbListResult);
}