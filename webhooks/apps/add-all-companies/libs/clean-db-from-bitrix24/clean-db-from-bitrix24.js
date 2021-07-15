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


// Удаляем мусор
const trashFromBX24 = [
  '2020_ 01_20 ФКУ Упрдор "Прибайкалье"',
  ' 2019_ 12_18 ООО "СИБИРСКИЙ КАДАСТРОВЫЙ ЦЕНТР"',
  'Test_ 3 ',
  'test_ test'
];

const addFieldToArr = (arr) => {
  let newArr = [];
  arr.forEach(it => {
    let obj = {};
    obj.TITLE = it;
    newArr.push(obj);
  });
  return newArr;
};
export const getDB24WithoutTrashlist = (db) => getArrWithoutListByField(
  db, addFieldToArr(trashFromBX24), `TITLE`);