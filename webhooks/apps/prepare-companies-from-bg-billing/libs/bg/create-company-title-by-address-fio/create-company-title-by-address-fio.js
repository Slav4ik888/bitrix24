import { cleanFio } from '../clean-fio/clean-fio.js';
import { Status } from '../../../types/types-require.js';


/**
 * Создаёт title для названия компании из населённого пункта и ФИО
 * @param {string} address 
 * @param {string} fio 
 * @returns {result: {status: Status.VALID, title }}
 */
export const createCompanyTitleByAddressFio = (address, fio) => {
  const preparedAddress = address + `_ `;
  const preparedFio = cleanFio(fio);

  const clientName = preparedAddress + preparedFio;

  const result = {
    status: Status.VALID,
    title: clientName,
  };

  if (!clientName) result.status = Status.INVALID;

  return result;
}