import { getItemFromArrByField } from '../../../utils/arrays/get-item-from-arr-by-field/get-item-from-arr-by-field.js';
import rules from './rules.js';

// Если населённый пункт отсутствует - добавляем его если есть в справочнике 
export const addLocaliy = (item) => {
  if (item.address) return item.address;

  let locality = ``;

  rules.forEach(regexp => {
    if (regexp.f.test(item.id)) {
      locality = regexp.r;
      console.log('locality: ', locality);
    }
  });

  return locality? locality : item.address;
};