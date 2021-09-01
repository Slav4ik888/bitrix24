// TEST CREATE PHONE
import { createReqList } from '../lib/create-req-str-from-all-fields/create-req-str-from-all-fields.js';
import { createBatches, sendAllBatches } from '../controllers/batchs-hook.js';
import { getResultFromResBx24 } from '../lib/get-result-from-res-bx24/get-result-from-res-bx24.js';
import { MethodType } from '../types.js';


// Создаём контакт через процедуру группового добавления
// Нужно чтобы сохранился телефон
export async function createContactWithPhone() {

  const json = '[{ "ORIGIN_ID": 1000, "CREATED_BY_ID": 1, "ASSIGNED_BY_ID": 1, "CONTRACT": "client.title", "COMMENT": "comment about client", "org": null, "LOCALITY": "locality Irk.obl", "TITLE": "test_ Korzan 1000", "statusTitle": true, "CONTACT": { "ADDRESS": "locality Irk.obl", "NAME": "TestNAME 1000", "LAST_NAME": "TestLAST_NAME 1000", "SECOND_NAME": "TestSECOND_NAME 1000", "PHONE": [{ "VALUE": "795011977767" }], "CREATED_BY_ID": 1, "ASSIGNED_BY_ID": 1 } }]';
  
  const client = JSON.parse(json);
  console.log('client: ', client);

  // Создаём строки запроса по ORIGIN_ID
  const reqList = createReqList(client, MethodType.CONTACT_ADD);
  
  // Делим по пачкам 50шт
  const batches = createBatches(reqList, MethodType.CONTACT_ADD);
  console.log('contactGroupAdd batches: ', batches);


  // Обработка полученных результатов
  const cbListResult = (res) => {
    console.log('res: ', res);

    const listContactIds = getResultFromResBx24(res);
    console.log('listContactIds: ', listContactIds);

    return listContactIds;
  }

  // Отправляем запрос
  sendAllBatches(batches, cbListResult);
}

