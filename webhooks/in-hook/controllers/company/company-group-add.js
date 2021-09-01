import { createReqList } from '../../lib/create-req-str-from-all-fields/create-req-str-from-all-fields.js';
import { createBatches, sendAllBatches } from '../batchs-hook.js';
import { MethodType } from '../../types.js';
import { showTimer } from '../../utils/timer/timer.js';
import { getResultFromResBx24 } from '../../lib/get-result-from-res-bx24/get-result-from-res-bx24.js';



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
    console.log('2 res: ', res);
    showTimer(timer.calls);

    const listCompanyIds = getResultFromResBx24(res);
    console.log('listCompanyIds: ', listCompanyIds);
    
    return callback(listCompanyIds);
  }

  // Отправляем запрос
  sendAllBatches(batches, cbListResult);
}