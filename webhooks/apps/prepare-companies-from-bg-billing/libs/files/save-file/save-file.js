import fs from 'fs';

export function saveDataToJSONfile(PATH, data) {
  fs.writeFileSync(PATH, JSON.stringify(data || '[]'), { encoding: `utf8` });
  
  return;
}

export const saveBGCompanies = (data) => saveDataToJSONfile(`./data/to/bg-companies.json`, data);
export const saveBGPersons = (data) => saveDataToJSONfile(`./data/to/bg-persons.json`, data);
export const saveBX24Persons = (data) => saveDataToJSONfile(`./data/to/bx24-persons.json`, data);

export const savePersonAddressList = (data) => saveDataToJSONfile(`./data/to/person-address-list.json`, data);