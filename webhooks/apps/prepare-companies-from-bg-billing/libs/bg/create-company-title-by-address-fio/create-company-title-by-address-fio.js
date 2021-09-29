import { cleanFio } from '../clean-fio/clean-fio.js';
import { Status } from '../../../types/types-require.js';

// Для названия "Компании" создаём приставку к населённому пункту
const getLabelNameForTitle = (client) => {
  const firstname = client.firstname || `Без_фамилии`; // Имя
  const lastname = client.lastname || ``;            // Фамилия
  const midname = client.midname || ``;            // Отчество

  return lastname + " " + firstname[0] + "." + midname[0] + ".";
};


/**
 * Создаёт title для названия компании из населённого пункта и ФИО
 * @param {string} address 
 * @param {object} client 
 * @returns {result: {status: Status.VALID, title }}
 */
export const createCompanyTitleByAddressFio = (address, client) => {
  const preparedAddress = address + `_ `;

  const clientName = preparedAddress + getLabelNameForTitle(client);

  const result = {
    status: Status.VALID,
    title: clientName,
  };

  if (!clientName) result.status = Status.INVALID;

  return result;
}