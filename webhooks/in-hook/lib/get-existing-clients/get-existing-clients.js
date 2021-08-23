// Выборка записей где вернулся результат, что компания с таким ORIGIN_ID существует
export const getExistingClients = (data) => {
  let result = [];

  for (let key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const objRes = data[key].result.result;
      for (let objKey in objRes) {
        if (Object.prototype.hasOwnProperty.call(objRes, objKey)) {
          if (objRes[objKey].length) result.push(objRes[objKey]);
        }
      }
    }
  }

  return result;
};