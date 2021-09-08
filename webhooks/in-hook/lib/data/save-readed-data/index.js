// Data
import { setStorageData } from '../../../utils/data/local-storage.js';
// Types
import { StorageName } from '../../../types.js';


export default function saveReadedData(data) {
  return setStorageData(StorageName.READED_DATA, data);
}