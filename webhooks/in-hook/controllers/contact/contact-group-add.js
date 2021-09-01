import { createReqList } from '../../lib/create-req-str-from-all-fields/create-req-str-from-all-fields.js';
import { createBatches, sendAllBatches } from '../batchs-hook.js';
import { MethodType } from '../../types.js';
import { showTimer } from '../../utils/timer/timer.js';
import { getResultFromResBx24 } from '../../lib/get-result-from-res-bx24/get-result-from-res-bx24.js';



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
    console.log('22 res: ', res);
    showTimer(timer.calls);

    const listContactIds = getResultFromResBx24(res);
    console.log('listContactIds: ', listContactIds);
    
    return callback(clearnedClients, listContactIds);
  }

  // Отправляем запрос
  sendAllBatches(batches, cbListResult);
}