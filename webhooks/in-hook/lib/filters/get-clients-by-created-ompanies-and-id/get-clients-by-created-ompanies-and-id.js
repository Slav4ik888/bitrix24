/**
 * Отбираем из общего списка те компаний, по которым вернулся ответ об их успешном создании
 * 
 * @param {Array} readedData - изначальный загруженный список
 * @param {preudo Array<{}>} listIds - список companies id
 */
export const getClientsByCreatedCompaniesAndId = (readedData, listIds) => {
  let result = [];

  for (let key in listIds) {
    if (Object.prototype.hasOwnProperty.call(listIds, key)) {
      const ORIGIN_ID = +key.slice(10); // key = ORIGIN_ID_1015

      let client = readedData.find(cl => cl.ORIGIN_ID === ORIGIN_ID);

      client.ID = listIds[key]; // Добавляем к компании ID созданный в  BX24
      result.push(client);
    }
  }

  return result;
}