import { companyGroupList } from '../../../archive/company-group-list.js';
import { companyGroupAdd } from '../../../controllers/company/company-group-add.js';
import { companyGroupConnectWithContact } from '../../../controllers/company/company-group-connect-with-contact.js';
import { contactGroupAdd } from '../../../controllers/contact/contact-group-add.js';
import { getClientsWithoutExistedCompanies } from '../../filters/get-clients-without-existed-companies/get-clients-without-existed-companies.js';
import { getClientsByCreatedCompaniesAndId } from '../../filters/get-clients-by-created-ompanies-and-id/get-clients-by-created-ompanies-and-id.js';
// Data
import { getStorageData } from '../../../utils/data/local-storage.js';
// Types
import { StorageName } from '../../../types.js';


export function startCreateGroupCompaniesWithContacts() {
  // Предварительно данные из загруженного файла сохраняются в LocalStorage
  // Then read data about all downloaded clients from LocalStorage
  const readedData = getStorageData(StorageName.READED_DATA);
  console.log('Прочитанное из файла: ', readedData);

  return createGroupCompaniesWithContacts(readedData)
}


/**
 * Создаёт Компанию и Контакт по тем ORIGIN_ID которых нет в Битриксе
 * Те что есть НЕ обновляет
 * 
 * @param {Array} readedData данные из загруженного файла
 */
export async function createGroupCompaniesWithContacts(readedData) {
  try {
    
    // Делаем запрос по всем компаниям и получаем результат о наличии ORIGIN_ID
    companyGroupList(readedData, cbResGroupList);

    // Обрабатываем данные по полученным имеющимся компаниями 
    function cbResGroupList(existingClients) {
      console.log('Уже зарегистрированные компании existingClients: ', existingClients);

      // Удаляем existingClients из общего списка компаний для создания
      const clearnedClients = getClientsWithoutExistedCompanies(readedData, existingClients);
      console.log('Загруженные компании очищенные от уже зарегистрированных ранее clearnedClients: ', clearnedClients);

      // [ 4 ] => создаём компании
      companyGroupAdd(clearnedClients, cbResCompanyGroupAdd);
    };

    // По оставшимся компаниям
    // [ 5 ]  => создаём компании
    
    function cbResCompanyGroupAdd(listCompanyIds) {
      console.log('Список удачно созданных компаний listCompanyIds: ', listCompanyIds);
      // {
      //   'ORIGIN_ID_1013': 5123,
      //   'ORIGIN_ID_1014': 5125,
      //   'ORIGIN_ID_1015': 5127,
      // }

      // Отбираем из общего списка те компаний, по которым вернулся ответ об их успешном создании
      const clientsByCreatedCompanies = getClientsByCreatedCompaniesAndId(readedData, listCompanyIds);
      console.log('clientsByCreatedCompanies: ', clientsByCreatedCompanies);


      // [ 6 ] => создаём контакты => соединяем company with contact
      contactGroupAdd(clientsByCreatedCompanies, companyGroupConnectWithContact);
    };

  }
  catch (e) {
    console.log(e);
  }
}