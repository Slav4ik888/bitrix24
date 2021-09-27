import { MethodType } from '../../types.js';
import { getGroupList } from '../get-group-list.js';



// Делаем запрос по всем компаниям и получаем результат о наличии ORIGIN_ID
export function getCompanyGroupList(readedData) {
  return getGroupList(readedData, MethodType.COMPANY_LIST);
}