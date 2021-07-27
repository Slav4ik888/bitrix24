/**
 * Возвращает массив без указанного элемента по itemField
 * @param {array} items 
 * @param {string} itemField - `id` || `email` || any
 * @param {obj} delItem 
 * test +
 */
export const getArrWithoutItemByField = (items, itemField, delItem) => {
  const idx = items.findIndex((item) => item[itemField] === delItem[itemField]);
  let newItems = [...items];
  if (idx !== -1) {
    newItems = [...newItems.slice(0, idx), ...newItems.slice(idx + 1)];
  }
  return newItems;
};