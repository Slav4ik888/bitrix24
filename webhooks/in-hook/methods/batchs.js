const axios = require('axios');
const { HOOK_URL } = require('../consts');
const { validationMethod, validationBatchList } = require('../validators');


/**
 * Отправляет 1 batch запрос с переданным списком команд для вызова на стороне Bitrix24
 * @param {String} method 
 * @param {Array of string item} listItems пример строки "crm.lead.add?fields[TITLE]=Test3 lead by robot nah&fields[CREATED_BY_ID]=2",
 * @returns 
 */
async function createOneBatch(method, listItems) {
  {
    const { valid, errors } = validationMethod(method);
    if (!valid) {
      console.log('errors: ', errors);
      return errors;
    }
  }
  {
    const { valid, errors } = validationBatchList(listItems);
    if (!valid) {
      console.log('errors: ', errors);
      return errors;
    }
  }
  
  let cmdObj = {};
  
  listItems.forEach((item, i) => cmdObj[method + i] = method + "?" + item);
  console.log('cmdObj: ', cmdObj);

  let obj = {
    "halt": 0,
    "cmd": cmdObj, 
  };

  try {
    await axios.post(`${HOOK_URL}/batch.json`, obj);
    console.log(`${HOOK_URL}/batch.json - successfully!`);

  } catch (e) {
    console.log('e: ', e);
  }
};


// Создаём много тестовых методов
// const createManyMethods = (method, value) => {
//   let cmd = {};

//   for (let i = 0; i < value; i++) {
//     let phone = `+795011970${i < 10 ? '0' + i : i}`;
//     let email = `korzan${i}@mail.ru`;
    
//     let obj = {
//       "TITLE": `Готол_Иванько Семён Семёныч`,
//       "CREATED_BY_ID": 1,
//       "ASSIGNED_BY_ID": 1,
//       "PHONE": [{ "VALUE": phone}],
//       "EMAIL": [{ "VALUE": email }],
//     };

//     cmd[`create_${i}`] = `${method}?fields[]` 
//   }
// }

module.exports = {
  createOneBatch,
};