/**
 * Возвращает массив с обновлёнными order по возрастанию
 * @param {Array} arr 
 * @returns 
 */
export const sortingOrderByArrIdx = (arr) => arr.map((item, i) => { // test +++
  item.order = String(100 + i * 100);
  return item;
});
