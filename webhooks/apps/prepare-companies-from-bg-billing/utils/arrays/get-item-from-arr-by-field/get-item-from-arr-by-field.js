/**
 * Возвращает item с соответствующим полем field === value
 * @param {array} arr 
 * @param {string} field - `id` || `email` || any
 * @param {string || number} value 
 */
export const getItemFromArrByField = (arr, field, value) => {
  if (!arr) return undefined;
  return arr.find((item) => item[field] === value);
};