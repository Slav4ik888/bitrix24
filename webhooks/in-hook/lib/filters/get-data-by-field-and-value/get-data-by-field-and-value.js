/**
 * Возвращает массив отфильтрованных данных
 * 
 * @param {array} arr - ReadedData
 * @param {string} field "LOCALITY"...
 * @param {*} value 
 */
export function getDataByFieldAndValue(arr, field, value) {
  const filtred = arr.filter((obj) => obj[field] === value);
  return filtred;
}