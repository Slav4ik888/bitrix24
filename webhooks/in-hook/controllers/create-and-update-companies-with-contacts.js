// Functions
import { getCompanyGroupList } from './company/get-company-group-list.js';
import { companyGroupAdd } from './company/company-group-add.js';
import { companyGroupConnectWithContact } from './company/company-group-connect-with-contact.js';
import { contactGroupAdd } from './contact/contact-group-add.js';
import { getDivededCompanies } from '../lib/filters/get-divided-companies/get-divided-companies.js';
import { getDivededContacts } from '../lib/filters/get-divided-contacts/get-divided-contacts.js';
import { getClientsByCreatedCompaniesAndId } from '../lib/filters/get-clients-by-created-ompanies-and-id/get-clients-by-created-ompanies-and-id.js';
import { getDataByFieldAndValue } from '../lib/filters/get-data-by-field-and-value/get-data-by-field-and-value.js';
import { companyGroupUpdate } from './company/company-group-update.js';
import { contactGroupUpdate } from './contact/contact-group-update.js';
import { getContactGroupList } from './contact/get-contact-group-list.js';
// Data
import { getStorageData } from '../utils/data/local-storage.js';
// Types
import { StorageName } from '../types.js';


// Если компания/контакт новые - создаёт
// Если существует - обновляет
export async function createAndUpdateCompaniesWithContacts() {
  try {
    // Берём данные из загруженного файла в Local
    const readedData = getStorageData(StorageName.READED_DATA);
  
    // Отбираем ~100 компаний из файла данных
    // const readedData = getDataByFieldAndValue(data, `LOCALITY`, `Тальники`);
    // const readedData = data.slice(0, 200);
    console.log('Всего будет обработано: ', readedData);


    // Делаем запрос по всем компаниям и получаем результат о наличии ORIGIN_ID
    const existingCompanies = await getCompanyGroupList(readedData);

    // Обрабатываем данные по полученным имеющимся компаниями 
    console.log('Клиенты уже зарегистрированные в BX24: ', existingCompanies);

    // Делим компании на те кто есть в Битрикс и тех кого ещё нет
    const { existCompanies, noExistCompanies } = getDivededCompanies(readedData, existingCompanies);
    console.log('COMPANIES');
    console.log('Отсутствуют  в BX24: ', noExistCompanies);
    console.log('Присутствуют в BX24: ', existCompanies);


    // ============================== //
    // =        СОЗДАЁМ НОВЫЕ       = //
    // ============================== //

    // Создаём компании
    const listCompanyIds = await companyGroupAdd(noExistCompanies);
    // {
    //   'ORIGIN_ID_1013': 5123,
    //   'ORIGIN_ID_1014': 5125,
    //   'ORIGIN_ID_1015': 5127,
    // }
    
    // Отбираем из общего списка те компаний, по которым вернулся ответ об их успешном создании
    const clientsByCreatedCompanies = getClientsByCreatedCompaniesAndId(noExistCompanies, listCompanyIds);
    if (clientsByCreatedCompanies.length) console.log('Созданные компании: ', clientsByCreatedCompanies);

    
    // Создаём контакты
    const { clearnedClients, listContactIds } = await contactGroupAdd(clientsByCreatedCompanies);
    console.log('listContactIds: ', listContactIds);
    console.log('clearnedClients: ', clearnedClients);

    // Соединяем компанию с контактом
    companyGroupConnectWithContact(clearnedClients, listContactIds);


    // ============================== //
    // =   ОБНОВЛЯЕМ СУЩЕСТВУЮЩИЕ   = //
    // ============================== //

    // Обновляем компании которые есть в Битрикс
    const listCompanyUpdateIds = await companyGroupUpdate(existCompanies);

    // Делаем запрос по всем контактам которые есть в базе и получаем их ID
    const existingContacts = await getContactGroupList(existCompanies);
    console.log('existingContacts: ', existingContacts);

    // Делим контакты на те кто есть в Битрикс и тех кого ещё нет
    const { existContacts, noExistContacts } = getDivededContacts(readedData, existingContacts);
    console.log('CONTACTS');
    console.log('Отсутствуют  в BX24: ', noExistContacts);
    console.log('Присутствуют в BX24: ', existContacts);

    // Обновляем контакты которые есть в Битрикс
    const listContactUpdateIds = await contactGroupUpdate(existContacts);
    console.log('listContactUpdateIds: ', listContactUpdateIds);
    

  }
  catch (e) {
    console.log('e: ', e);
  }
}