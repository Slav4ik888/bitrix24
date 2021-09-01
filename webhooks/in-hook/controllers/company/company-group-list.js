import { createReqList } from '../../lib/create-req-str-from-all-fields/create-req-str-from-all-fields.js';
import { getExistingClients } from '../../lib/get-existing-clients/get-existing-clients.js';
import { createBatches, sendAllBatches } from '../batchs-hook.js';
import { MethodType } from '../../types.js';
import { showTimer } from '../../utils/timer/timer.js';



// Делаем запрос по всем компаниям и получаем результат о наличии ORIGIN_ID
export async function companyGroupList(readedData, callback) {

  // Создаём строки запроса по ORIGIN_ID
  const reqList = createReqList(readedData, MethodType.COMPANY_LIST);
  
  // Делим по пачкам 50шт
  const batches = createBatches(reqList, MethodType.COMPANY_LIST);
  console.log('Send req to find overlap ORIGIN_ID: ', batches);

  // Обработка полученных результатов
  const cbListResult = (res, timer) => {
    showTimer(timer.calls);

    const existingClients = getExistingClients(res);
    return callback(existingClients);
  }

  // Отправляем запрос
  sendAllBatches(batches, cbListResult);
}