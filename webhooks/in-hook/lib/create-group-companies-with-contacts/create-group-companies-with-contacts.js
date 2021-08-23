import { readJSONAndProcessData } from '../../utils/files/files.js';
import { companyGroupList } from '../../controllers/company/company-group-list.js';
import { companyGroupAdd } from '../../controllers/company/company-group-add.js';
import { companyGroupConnectWithContact } from '../../controllers/company/company-group-connect-with-contact.js';
import { contactGroupAdd } from '../../controllers/contact/contact-group-add.js';
import { getClientsWithoutExistedCompanies } from '../get-clients-without-existed-companies/get-clients-without-existed-companies.js';
import { getClientsByCreatedCompaniesAndId } from '../get-clients-by-created-ompanies-and-id/get-clients-by-created-ompanies-and-id.js';



export const addUploadListener = () => {
  const fileUpload = document.querySelector(`.file-upload`);
  const fileUploadSubmit = document.querySelector(`.file-upload-submit`);

  const saveDataFunc = (data) => {
    localStorage.setItem(`hookReadedData`, JSON.stringify(data));
  };

  saveDataFunc()
  fileUploadSubmit.disabled = false;

  fileUpload.addEventListener(`change`, (e) => {
    readJSONAndProcessData(e, saveDataFunc);
    fileUploadSubmit.disabled = false;
  });
};



// Проверить есть ли компания => создать компанию => создать контакт => соединить

export async function createGroupCompaniesWithContacts() {
  try {
    // [ 1 ] - Read data about all downloaded clients 
    const readedData = JSON.parse(localStorage.getItem(`hookReadedData`));
    console.log('readedData: ', readedData);
    
    // [ 2 ] - Делаем запрос по всем компаниям и получаем результат о наличии ORIGIN_ID
    companyGroupList(readedData, cbResGroupList);

    // [ 3 ] - Обрабатываем данные по полученным имеющимся компаниями 
    function cbResGroupList(existingClients) {
      console.log('existingClients: ', existingClients);

      // Удаляем existingClients из общего списка компаний для создания
      const clearnedClients = getClientsWithoutExistedCompanies(readedData, existingClients);
      console.log('clearnedClients: ', clearnedClients);

      // [ 4 ] => создаём компании
      companyGroupAdd(clearnedClients, cbResCompanyGroupAdd);
    };

    // По оставшимся компаниям
    // [ 5 ]  => создаём компании
    
    function cbResCompanyGroupAdd(listCompanyIds) {
      console.log('listCompanyIds: ', listCompanyIds);
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