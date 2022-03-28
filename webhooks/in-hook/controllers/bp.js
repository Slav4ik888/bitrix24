import * as f from '../lib/creates/create-fields/create-fields.js';
import * as bx24 from './bd-methods-bx24.js';


export const businessProcessList = () => {
  const params = f.createFieldsForBusinessProcessList();
  console.log('params: ', params);

  return bx24.crmBusinessProcessList(params);
};


export const businessProcessStartBC = async (form) => {
  console.log('form: ', form);
  const params = {
    OTV_QUALITY       : form.OTV_QUALITY.value || `1`,
    COMPANY_ID        : form.COMPANY_ID.value  || `1`,
    IS_NEW_SUBSCRIBER : form.IS_NEW_SUBSCRIBER.value
  };

  // if (!params.OTV_QUALITY || !params.COMPANY_ID) return console.log(`Нельзя запустить БП без данных`);
  
  const fields = f.createFieldsForBusinessProcessStart(params);
  return bx24.crmBusinessProcessStartBC(fields);
};
