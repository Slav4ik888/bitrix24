import { readJSONAndProcessData } from '../../utils/files/files.js';
import { companyGroupList } from '../../controllers/company/company-group-list.js';


export const addUploadListener = () => {
  const fileUpload = document.querySelector(`.file-upload`);
  const fileUploadSubmit = document.querySelector(`.file-upload-submit`);

  const saveDataFunc = (data) => {
    localStorage.setItem(`hookReadedData`, JSON.stringify(data));
  };

  fileUpload.addEventListener(`change`, (e) => {
    readJSONAndProcessData(e, saveDataFunc);
    fileUploadSubmit.disabled = false;
  });
};


/**
 * Возвращает компании без тех что уже есть в Битриксе
 * @param {array} allClients 
 * @param {array<array<{}>>} existingClients 
 */
const removedExistingClients = (allClients, existingClients) => {
  let restClients = [];

  allClients.forEach((client) => {
    console.log('client: ', client.ORIGIN_ID);
    let resFind = undefined;

    for (let key in existingClients) {
      if (Object.prototype.hasOwnProperty.call(existingClients, key)) {
        resFind = existingClients[key].find((exClient) => +exClient.ORIGIN_ID === client.ORIGIN_ID);
      }
    }
    if (!resFind) restClients.push(client);

    resFind = undefined;
  });

  return restClients;
};



// Проверить есть ли компания => создать компанию => создать контакт => соединить

export async function createGroupCopmaniesWithContacts() {
  try {
    // allClients 
    const readedData = JSON.parse(localStorage.getItem(`hookReadedData`));
    console.log('readedData: ', readedData);
    
  

    // Получение данных по имеющимся компаниями 
    const cbResGroupList = (existingClients) => {
      console.log('existingClients: ', existingClients);
      // Удаляем existingClients из общего списка компаний для создания
      const clearnedClients = removedExistingClients(readedData, existingClients);
      console.log('clearnedClients: ', clearnedClients);

    };

    // Делаем запрос по всем компаниям и получаем результат о наличии ORIGIN_ID
    companyGroupList(readedData, cbResGroupList);


    // По оставшимся компаниям
    

    //   => создаём компании
    //   => создаём контакты
    //   => объединяем

  }
  catch (e) {
    console.log(e);
  }
}