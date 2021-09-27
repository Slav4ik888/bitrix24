import { MethodType, StorageName } from '../../types.js';


export const getStorageResByMethod = (method) => {
  switch (method) {
    case MethodType.COMPANY_ADD         : return StorageName.ADDED_COMPANIES_RES;
    case MethodType.COMPANY_UPDATE      : return StorageName.UPDATED_COMPANIES_RES; 
    case MethodType.COMPANY_CONTACT_ADD : return StorageName.CONNECTED_RES;
    case MethodType.CONTACT_ADD         : return StorageName.ADDED_CONTACTS_RES;
    case MethodType.CONTACT_UPDATE      : return StorageName.UPDATED_CONTACTS_RES;
    
    default: ``;
  }
};

export const getStorageIdsByMethod = (method) => {
  switch (method) {
    case MethodType.COMPANY_ADD         : return StorageName.ADDED_COMPANIES_IDS;
    case MethodType.COMPANY_UPDATE      : return StorageName.UPDATED_COMPANIES_IDS;
    case MethodType.COMPANY_CONTACT_ADD : return StorageName.CONNECTED_LIST;
    case MethodType.CONTACT_ADD         : return StorageName.ADDED_CONTACTS_IDS;
    case MethodType.CONTACT_UPDATE      : return StorageName.UPDATED_CONTACTS_IDS;
    
    default: ``;
  }
}