import { cleanAddress } from '../clean-address/clean-address.js';
import { cleanFio } from '../clean-fio/clean-fio.js';
import { Status } from '../../types/types-require.js';


// Создаёт title для названия компании из населённого пункта и ФИО
export const createCompanyTitleByAddressFio = (address, fio) => {
  const cleanedAddress = cleanAddress(address);
  const cleanedFio = cleanFio(fio)

  const companyName = cleanedAddress + cleanedFio;

  const result = {
    status: Status.VALID,
    title: companyName,
  };

  if (!companyName) result.status = Status.INVALID;

  return result;
}