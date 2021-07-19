/**
 * Возвращает объект без trashList по полю field
 * @param {Array} db 
 * @param {Array} trashList 
 * @param {string} field 
 * @returns 
 */
export const getArrWithoutListByField = (db, trashList, field) => {
  const newDb = [];
  db.forEach(item => {
    if (!trashList.find(trash => item[field] === trash[field])) newDb.push(item);
  });
  return newDb;
};