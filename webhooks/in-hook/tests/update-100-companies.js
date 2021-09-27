// Functions
import { getCompanyGroupList } from '../controllers/company/get-company-group-list.js';
import { companyGroupAdd } from '../controllers/company/company-group-add.js';
import { companyGroupConnectWithContact } from '../controllers/company/company-group-connect-with-contact.js';
import { contactGroupAdd } from '../controllers/contact/contact-group-add.js';
import { getDivededCompanies } from '../lib/filters/get-divided-companies/get-divided-companies.js';
import { getDivededContacts } from '../lib/filters/get-divided-contacts/get-divided-contacts.js';
import { getClientsByCreatedCompaniesAndId } from '../lib/filters/get-clients-by-created-ompanies-and-id/get-clients-by-created-ompanies-and-id.js';
import { getDataByFieldAndValue } from '../lib/filters/get-data-by-field-and-value/get-data-by-field-and-value.js';
import { companyGroupUpdate } from '../controllers/company/company-group-update.js';
import { contactGroupUpdate } from '../controllers/contact/contact-group-update.js';
import { getContactGroupList } from '../controllers/contact/get-contact-group-list.js';
// Data
import { getStorageData } from '../utils/data/local-storage.js';
// Types
import { StorageName } from '../types.js';


export async function update100Companies() {
  try {
    // Берём данные из загруженного файла в Local
    const data = getStorageData(StorageName.READED_DATA);
  
    // Отбираем ~100 компаний из файла данных
    const readedData = getDataByFieldAndValue(data, `LOCALITY`, `Тальники`);
    console.log('readedData: ', readedData);

    // Делаем запрос по всем компаниям и получаем результат о наличии ORIGIN_ID
    const existingCompanies = await getCompanyGroupList(readedData);

    // Обрабатываем данные по полученным имеющимся компаниями 
    console.log('Клиенты уже зарегистрированные в BX24: ', existingCompanies);

    // Делим компании на те кто есть в Битрикс и тех кого ещё нет
    const { existCompanies, noExistCompanies } = getDivededCompanies(readedData, existingCompanies);
    console.log('noExistCompanies: ', noExistCompanies);
    console.log('existCompanies: ', existCompanies);


    // ============================== //
    // =        СОЗДАЁМ НОВЫЕ       = //
    // ============================== //

    // Создаём компании
    const listCompanyIds = await companyGroupAdd(noExistCompanies);
    console.log('Список созданных компаний listCompanyIds: ', listCompanyIds);
    // {
    //   'ORIGIN_ID_1013': 5123,
    //   'ORIGIN_ID_1014': 5125,
    //   'ORIGIN_ID_1015': 5127,
    // }
    
    // Отбираем из общего списка те компаний, по которым вернулся ответ об их успешном создании
    const clientsByCreatedCompanies = getClientsByCreatedCompaniesAndId(noExistCompanies, listCompanyIds);
    if (clientsByCreatedCompanies.length) console.log('clientsByCreatedCompanies: ', clientsByCreatedCompanies);

    
    // Создаём контакты
    const { clearnedClients, listContactIds } = await contactGroupAdd(clientsByCreatedCompanies);
    console.log('listContactIds: ', listContactIds);
    console.log('clearnedClients: ', clearnedClients);

    // Соединяем компанию с контактом
    companyGroupConnectWithContact(clearnedClients, listContactIds);


    // ============================== //
    // =   ОБНОВЛЯЕМ СУЩЕСТВУЮЩИЕ   = //
    // ============================== //

    const listCompanyUpdateIds = await companyGroupUpdate(existCompanies);
    console.log('listCompanyUpdateIds: ', listCompanyUpdateIds);

    // Делаем запрос по всем контактам которые есть в базе и получает их ID
    const existingContacts = await getContactGroupList(existCompanies);
    console.log('existingContacts: ', existingContacts);

    // Делим контакты на те кто есть в Битрикс и тех кого ещё нет
    const { existContacts, noExistContacts } = getDivededContacts(readedData, existingContacts);
    console.log('noExistContacts: ', noExistContacts);
    console.log('existContacts: ', existContacts);


    const listContactUpdateIds = await contactGroupUpdate(existContacts);
    console.log('listContactUpdateIds: ', listContactUpdateIds);
    

  }
  catch (e) {
      console.log('e: ', e);
  }
}