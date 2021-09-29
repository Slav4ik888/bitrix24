import { groupUpdate } from '../get-group-update.js';
import { MethodType } from '../../types.js';

// Групповое обновление контактов
export async function contactGroupUpdate(companies) {
  console.log(`UPDATE CONTACTS: `, companies);

  return groupUpdate(companies, MethodType.CONTACT_UPDATE);
};
