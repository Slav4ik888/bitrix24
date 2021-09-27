import { createReqList } from '../lib/creates/create-requests/create-req-list.js';
import { getExistingClients } from '../lib/filters/get-existing-clients/get-existing-clients.js';
import { createBatches, sendAllBatches } from './batchs-hook.js';
import { showTimer } from '../utils/timer/timer.js';



export function getGroupList(readedData, method) {
  return new Promise(async function (resolve, reject) {
    try {
      // Создаём строки запроса по ORIGIN_ID
      const reqList = createReqList(readedData, method);
    
      // Делим по пачкам 50шт
      const batches = createBatches(reqList, method);
      console.log('Send req to find overlap ORIGIN_ID: ', batches);

      // Отправляем запрос
      const { result, timer } = await sendAllBatches(batches);
      showTimer(timer.calls);

      const сlients = getExistingClients(result);
      return resolve(сlients);
    }
    catch (e) {
      console.log('e: ', e);
      reject(e)
    }
  })
}