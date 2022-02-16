import * as f from './forms.js';
import * as com from './company.js';
import * as c from './company-methods-bx24.js';
import * as cli from './contact.js';
import { createNewCompanyWithContact } from '../lib/creates/create-new-company-with-contact/create-new-company-with-contact.js';
import { startCreateGroupCompaniesWithContacts } from '../lib/creates/create-group-companies-with-contacts/create-group-companies-with-contacts.js';
import { createContactWithPhone } from '../tests/create-contact-with-phone.js';
// Tests
import { createAndUpdateCompaniesWithContacts } from './create-and-update-companies-with-contacts.js';
import { testConnectContactsWithCompanies } from './connect-contacts-companies.js';

const checkResult = (data) => {
  if (data) console.log('checkResult: ', data);

  if (data?.result) return data.result;
  if (data) return data; // На тот случай когда
  return data?.error_description;

}

// Созданные:
// ID 5019 - Тест_ Иванько Семён Семёныч
// ID 5061 - Чемодариха_ Копыстинский Петр Михайлович
  // 7793

const mockCompanyData = {
  "ORIGIN_ID": 1102,
  "CREATED_BY_ID": 1,
  "ASSIGNED_BY_ID": 1,
  "CONTRACT": "9021744185",
  "COMMENT": "id: 1014, title: 9021744185, phone: null, fio: Копыстинский Петр Михайлович, org: null, sernum: null, issuer: null, issuedate: null, login: 10010082, address: Чемодариха, ",
  "org": null,
  "LOCALITY": "TEST",
  "TITLE": "Test_ Копыстинский Петр Михайлович",
  "statusTitle": "valid",

  "CONTACT": {
    "ADDRESS": "Чемодариха",
    "NAME": "Test",
    "LAST_NAME": "Копыстинский",
    "SECOND_NAME": "Михайлович",
    "PHONE": [{ "VALUE": "" }],
    "CREATED_BY_ID": 1,
    "ASSIGNED_BY_ID": 1
  }
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
  console.log('Запрос: ', hookQuery);
  const form = e.target;

  let result;

  switch (hookQuery) {
    case 'test-create-contact-with-phone':
      result = await createContactWithPhone(); break;
    
    case 'test-create-company-with-contact':
      result = await createNewCompanyWithContact(mockCompanyData); break;

    case 'test-connect-contacts-with-companies':
      result = await testConnectContactsWithCompanies(); break;
    
    // PRODACTION
    case 'create-and-update-companies-with-contacts':
      result = await createAndUpdateCompaniesWithContacts(); break;
    
    // COMPANY
    case 'crm-company-fields':
      result = await c.companyFields(); break;
    
    case 'crm-company-contact-fields':
      result = await com.companyContactFields(); break;
    
    case 'crm-company-list-by-origin-id':
      result = await f.companyListByOriginId(form); break;
    
    case 'crm-company-add':
      result = await f.companyAdd(form); break;
    
    case 'crm-company-get':
      result = await f.companyGet(form); break;
    
    case 'crm-company-contact-add':
      result = await f.companyContactAdd(form); break;
    
    case 'crm-company-update':
      result = await f.companyUpdate(form); break;
    
    case 'crm-company-delete':
      result = await f.companyDelete(form); break;

    // COMPANY USERFIELDS

    case 'crm.userfield.fields':
      result = await c.crmCompanyUserfields(); break;
    
    case 'crm.company.userfield.add':
      result = await f.companyUserfields(form); break;
    
    
    // CONTACTS
    
    case 'crm-multifield-fields':
      result = await cli.multifieldFields(); break;
    
    case 'crm-contact-fields':
      result = await cli.contactFields(); break;
    
    case 'crm-contact-get':
      result = await f.contactGet(form); break;
    
    case 'crm-contact-add':
      result = await f.contactAdd(form); break;
    
    case 'crm-contact-delete':
      result = await f.contactDelete(form); break;
    
    
  }


  if (result) console.log(checkResult(result));

  return;
};