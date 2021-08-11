import * as com from './company.js';
import * as cli from './contact.js';


const checkResult = (data) => {
  console.log('checkResult: ', data);

  if (data?.result) return data.result;
  if (data) return data; // На тот случай когда
  return data?.error_description;

}

// Созданные:
// ID 5019 - Тест_ Иванько Семён Семёныч
// ID 5049 - 



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
    case 'crm-company-add':
      result = await com.companyAdd(form); break;
    
    case 'crm-company-get':
      result = await com.companyGet(form); break;
    
    case 'crm-company-delete':
      result = await com.companyDelete(form); break;
    
    case 'crm-company-contac-fields':
      result = await cli.companyContactFields(); break;
    
  }


  console.log(checkResult(result));

  return;
};