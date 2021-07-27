/**
 * Возвращает было ли изменение в сортировке массивов
 * @param {Array} lastSort 
 * @param {Array} newSort 
 * @param {String} field
 */
export const isChangeInSortingOrder = (lastSort, newSort, field) => {
  return lastSort.find((lastItem, i) => lastItem[field] !== newSort[i][field]);
};