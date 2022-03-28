import { HOOK_URL, paramsPOST } from '../consts/consts.js';


export async function crmBusinessProcessList(params) {
  try {
    paramsPOST.body = JSON.stringify(params);
    console.log('paramsPOST.body: ', paramsPOST.body);

    const response = await fetch(`${HOOK_URL}/bizproc.workflow.template.list.json`, paramsPOST);
    const businessProcessData = await response.json();
    console.log('businessProcessData: ', businessProcessData);

    return businessProcessData.result;
  }
  catch (e) { console.log('e: ', e); console.error(e); return }
}


export const crmBusinessProcessStartBC = async (params) => {
  try {
    paramsPOST.body = JSON.stringify({ params });
    console.log('paramsPOST.body: ', paramsPOST.body);

    const response = await fetch(`${HOOK_URL}/bizproc.workflow.start.json`, paramsPOST);
    const bpResult = await response.json();
    console.log('bpResult: ', bpResult);

    return bpResult;
  }
  catch (e) { console.log('e: ', e); console.error(e); return }
}
