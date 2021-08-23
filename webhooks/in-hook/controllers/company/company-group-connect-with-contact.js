import { createReqList } from '../../lib/create-req-str-from-all-fields/create-req-str-from-all-fields.js';
import { createBatches, sendAllBatches } from '../batchs-hook.js';
import { MethodType } from '../../types.js';
import { showTimer } from '../../utils/timer/timer.js';
import { getResultFromResBx24 } from '../../lib/get-result-from-res-bx24/get-result-from-res-bx24.js';
// import { getItemFromArrByField } from '../../utils/arrays/get-item-from-arr-by-field/get-item-from-arr-by-field.js';



// Групповое объединение компаний с контактами
export async function companyGroupConnectWithContact(clientsByCreatedCompanies, listContactIds) {
  console.log('listContactIds: ', listContactIds);

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
    client.CONTACT_ID = listContactIds[fieldName] // getItemFromArrByField(listContactIds, `ORIGIN_ID`, ORIGIN_ID);
    // console.log('client: ', client);

    clientsForConnect.push(client);
  })

  // Создаём строки запроса по ORIGIN_ID
  const reqList = createReqList(clientsForConnect, MethodType.COMPANY_CONTACT_ADD);
  
  // Делим по пачкам 50шт
  const batches = createBatches(reqList, MethodType.COMPANY_CONTACT_ADD);
  console.log('companyGroupConnectWithContact batches: ', batches);


  // Обработка полученных результатов
  const cbListResult = (res, timer) => {
    console.log('res: ', res);
    showTimer(timer.calls);

    const listResult = getResultFromResBx24(res);
    console.log('listResult: ', listResult);
    // КОНЕЦ
  }

  // Отправляем запрос
  sendAllBatches(batches, cbListResult);
}