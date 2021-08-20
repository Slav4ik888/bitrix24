import { saveDataToJSONfile } from '../libs/files/save-file/save-file.js';


const TEST_CLIENTS_COUNT = 102;
const pathFile = `./data/to/test-clients.json`;
 
const prepareClient = (ORIGIN_ID) => {
  let preparedClient = {};

  preparedClient.ORIGIN_ID = ORIGIN_ID;
  preparedClient.CREATED_BY_ID = 1;
  preparedClient.ASSIGNED_BY_ID = 1;
  preparedClient.CONTRACT = `client.title`;
  preparedClient.COMMENT = `comment about client`;
  preparedClient.org = null;
  preparedClient.LOCALITY = `locality Irk.obl`;

  // Создаём название
  preparedClient.TITLE = `test_ Korzan ${ORIGIN_ID}`;
  preparedClient.statusTitle = true;

  // Добавляем поля для создания "Контакта" в BX24
  preparedClient.CONTACT = {};
  preparedClient.CONTACT.ADDRESS = `locality Irk.obl`;
  
  preparedClient.CONTACT.NAME = `TestNAME ${ORIGIN_ID}`;
  preparedClient.CONTACT.LAST_NAME = `TestLAST_NAME ${ORIGIN_ID}`;
  preparedClient.CONTACT.SECOND_NAME = `TestSECOND_NAME ${ORIGIN_ID}`;
  
  preparedClient.CONTACT.PHONE = [{ VALUE: `795011977767` || null }];
  preparedClient.CONTACT.CREATED_BY_ID = 1;
  preparedClient.CONTACT.ASSIGNED_BY_ID = 1;

  return preparedClient;
};


const prepareTestClient = () => {
  let clients = [];

  for (let i = 0; i <= TEST_CLIENTS_COUNT; i++) {
    const ORIGIN_ID = i + 1000;
    const client = prepareClient(ORIGIN_ID);
    clients.push(client);
  }
  return clients;
};

const saveTestClients = (data) => saveDataToJSONfile(pathFile, data);


// INITIALIZATION
const preparedClients = prepareTestClient();
// console.log('preparedClients: ', preparedClients);

saveTestClients(preparedClients);