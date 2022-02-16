// Functions
import { getCompanyGroupList } from './company/get-company-group-list.js';
import { companyGroupAdd } from './company/company-group-add.js';
import { companyGroupConnectWithContact } from './company/company-group-connect-with-contact.js';
import { contactGroupAdd } from './contact/contact-group-add.js';
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


export async function testConnectContactsWithCompanies() {

  try {
    // Берём данные из загруженного файла в Local
    const readedData = getStorageData(StorageName.READED_DATA);

    // Проверяем созданы ли в БХ контакты из файла

    // Делаем запрос по всем контактам и получаем результат о наличии ORIGIN_ID
    const existingContacts = await getContactGroupList(readedData);

    // Обрабатываем данные по полученным имеющимся контактам 
    console.log('Контакты уже зарегистрированные в BX24: ', existingContacts);

    // Делим компании на те кто есть в Битрикс и тех кого ещё нет
    const { existContacts, noExistContacts } = getDivededContacts(readedData, existingContacts);
    console.log('CONTACTS');
    console.log('Отсутствуют  в BX24: ', noExistContacts);
    console.log('Присутствуют в BX24: ', existContacts);


    // --------------------------------- //
    //      По Отсутствующими в BX24     //
    // --------------------------------- //

    // Запросить список компаний по ORIGIN_ID
    // Делаем запрос по всем компаниям и получаем результат о наличии ORIGIN_ID
    const existingCompanies = await getCompanyGroupList(noExistContacts);
    console.log('existingCompanies: ', existingCompanies);

    let refactCompanies = [];
    existingCompanies.forEach(com => {
      refactCompanies.push(com[0])
    });
    console.log('refactCompanies: ', refactCompanies);

    // Создаём контакты
    let connectCompanies = [];
    refactCompanies.forEach(company => {
      const CONTACT = noExistContacts.find(contact => contact.ORIGIN_ID.toString() === company.ORIGIN_ID);

      if (CONTACT) connectCompanies.push({
        ...company,
        CONTACT
      })
    });

    console.log('connectCompanies: ', connectCompanies);

    const { clearnedClients, listContactIds } = await contactGroupAdd(connectCompanies);
    console.log('listContactIds: ', listContactIds);
    console.log('clearnedClients: ', clearnedClients);

    // Соединяем компанию с контактом
    companyGroupConnectWithContact(clearnedClients, listContactIds);

  }
  catch (e) {
    console.log('e: ', e);
  }
}
