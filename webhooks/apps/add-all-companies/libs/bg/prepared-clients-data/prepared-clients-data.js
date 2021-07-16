import { prepareClient } from '../prepare-client/prepare-client.js';
import { getFirstWord } from '../../get-word-by-number/get-word-by-number.js';

// Список исключений которые нужно отловить по инфо в адресе
// Компании у которых org = null но в адресе присутствует данные слова
const companyAddress = [
  { f: /рим/i, r: `` },
  { f: /Иркутск/i, r: `` },
  { f: /Лермонтова/i, r: `` },
  { f: /Разрез/i, r: `` },
];


/**
 * Проверяет address на наличие в 1м слове находится ли он в списке исключений
 * @param {Array<{f: `regexp`}>} regExpArr 
 * @param {string} title 
 * @returns 
 */ 
const findCurrentAddressInFirstWord = (regExpArr,  title) => {
  let result = false;
  const checkTitle = getFirstWord(title);

  regExpArr.find((item) => {
    if (item.f.test(checkTitle)) result = true;
  });
  return result;
};


/**
 * Создаём объекты для всех клиентов, для помещения их в Битрикс
 * @param {array} db - исходные данные из BGbilling
 * @param {number} limit_clients 
 * @returns {counts: { countAll, countValid, countInvalid }, dbPersons, dbInvalidClients}
 */
export const prepareClientsData = (db, limit_clients) => {
  let countAll = 0, countValid = 0, countInvalid = 0;
  let dbPersons = [], dbCompanies = [], dbInvalidClients = [];

  db.forEach((clientBilling, i) => {
    if (i < limit_clients || !limit_clients) {
      countAll++;
      const { valid, client } = prepareClient(clientBilling);

      if (valid) {
        countValid++;

        if (client.org) {
          dbCompanies.push(client)
        }
        // Компании исключения, которые не нужно чтобы попали в ФЛ
        else if (findCurrentAddressInFirstWord(companyAddress, client.TITLE)) {
          // console.log(client.TITLE);
          dbCompanies.push(client)
        }
        else dbPersons.push(client);

      } else {
        countInvalid++;
        dbInvalidClients.push(client);
      }
    }
  });

  return {
    countersBG: {
      countAll, countValid, countInvalid,
      countPerson: dbPersons.length,
      countCompanies: dbCompanies.length,
      dbBGL: db.length,
    },
    dbPersons,
    dbCompanies,
    dbInvalidClients
   }
};