import fs from 'fs';

export function saveDataToJSONfile(PATH, data) {
  fs.writeFileSync(PATH, JSON.stringify(data || '[]'), { encoding: `utf8` });
  
  return;
}

export const saveCompanies = (data) => saveDataToJSONfile(`./data/companies.json`, data);
export const savePersons = (data) => saveDataToJSONfile(`./data/persons.json`, data);