// BX24
import { createReqList } from '../../lib/creates/create-requests/create-req-list.js';
import { createBatches, sendAllBatches } from '../batchs-hook.js';
// Helpers
import { showTimer } from '../../utils/timer/timer.js';
import { getResultFromResBx24 } from '../../lib/get-result-from-res-bx24/get-result-from-res-bx24.js';
// Data
import { setStorageData } from '../../utils/data/local-storage.js';
// Types
import { StorageName, MethodType } from '../../types.js';



// Подготавливает и возвращает массив клиентов для соединения с компанией
const prepareClientsForConnect = (clientsByCreatedCompanies, listContactIds) => {
  let clientsForConnect = [];
  // id=${item.ID}
  // &fields[CONTACT_ID]=${item.CONTACT_ID}
  // &fields[IS_PRIMARY]=${item.IS_PRIMARY}

  clientsByCreatedCompanies.forEach((item) => {
    let client = {};
    // Get created company
    client.ID = item.ID;
    const fieldName = `ORIGIN_ID_${item.ORIGIN_ID}`;
    // Find Contact by ORIGIN_ID
    client.CONTACT_ID = listContactIds[fieldName];
    // console.log('client: ', client);
    clientsForConnect.push(client);
  });

  return clientsForConnect;
};



/**
 * Групповое объединение компаний с контактами
 * @param {*} clientsByCreatedCompanies 
 * @param {*} listContactIds 
 */
export async function companyGroupConnectWithContact(clientsByCreatedCompanies, listContactIds) {
  try {
    if (!listContactIds) {
      console.log(`Нет компаний для соединения...`);
      return;
    }
    console.log('listContactIds для соединения с компаниями: ', listContactIds);

    const clientsForConnect = prepareClientsForConnect(clientsByCreatedCompanies, listContactIds);

    // Создаём строки запроса по ORIGIN_ID
    const reqList = createReqList(clientsForConnect, MethodType.COMPANY_CONTACT_ADD);
  
    // Делим по пачкам 50шт
    const batches = createBatches(reqList, MethodType.COMPANY_CONTACT_ADD);
    console.log('companyGroupConnectWithContact batches: ', batches);

    // Отправляем запрос
    const { result, timer } = await sendAllBatches(batches);
    setStorageData(StorageName.CONNECTED_RES, result);
    console.log('CONNECTED_RES: ', result);
    showTimer(timer.calls);

    const listResult = getResultFromResBx24(result);
    setStorageData(StorageName.CONNECTED_LIST, result);
    console.log('CONNECTED_LIST: ', listResult);
    // КОНЕЦ
  }
  catch (e) {
    console.log('e: ', e);
  }
}