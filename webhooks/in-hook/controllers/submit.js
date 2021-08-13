import * as f from './forms.js';
import * as com from './company.js';
import * as cli from './contact.js';
import { createNewCompanyWithContact } from '../lib/create-new-company-with-contact/create-new-company-with-contact.js';



const checkResult = (data) => {
  console.log('checkResult: ', data);

  if (data?.result) return data.result;
  if (data) return data; // На тот случай когда
  return data?.error_description;

}

// Созданные:
// ID 5019 - Тест_ Иванько Семён Семёныч
// ID 5049 - 

const mockCompanyData = {
  "ORIGIN_ID": 2,
  "CREATED_BY_ID": 1,
  "ASSIGNED_BY_ID": 1,
  "CONTRACT": "1000047",
  "PHONE": [{ "VALUE": null }],
  "COMMENT": "id: 302, title: 1000047, phone: null, fio: null, org: null, sernum: null, issuer: null, issuedate: null, login: 1000047, address: null, ",
  "org": null,
  "LOCALITY": "",
  "TITLE": "Балабаново_ Сидоров Глеб Михалыч",
  "statusTitle": "valid"
};


/**
 * Submit на формы, определяет какую форму запустили и отправляет соответствующий запрос
 * 
 * @param {Event} e 
 * @returns 
 */
export default async function (e) {
  e.preventDefault();
  const hookQuery = e.target.name; // .replace(/-/g,".");
  const form = e.target;

  let result;

  switch (hookQuery) {
    case 'test-create-company-with-contact':
      result = await createNewCompanyWithContact(mockCompanyData); break;

    case 'crm-company-list':
      result = await f.companyList(form); break;
    
    case 'crm-company-add':
      result = await f.companyAdd(form); break;
    
    case 'crm-company-get':
      result = await f.companyGet(form); break;
    
    case 'crm-company-delete':
      result = await f.companyDelete(form); break;
    
    case 'crm-company-contac-fields':
      result = await cli.companyContactFields(); break;
    
  }


  console.log(checkResult(result));

  return;
};