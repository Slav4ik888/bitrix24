import { groupUpdate } from '../get-group-update.js';
import { MethodType } from '../../types.js';

// Групповое обновление компаний
export async function companyGroupUpdate(companies) {
  console.log(`Обновляем компании: `, companies);

  return groupUpdate(companies, MethodType.COMPANY_UPDATE);
};

