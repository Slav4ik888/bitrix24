
/**
 * Возвращает отфильтрованный массив по полю и значению
 * @param {Array} arr - список компаний
 * @param {String} field - поле по которому фильтровать
 * @param {String} regexp - значение которое прислал пользователь
 */
export const filterArrByFieldAndRegexp = (arr, field, regexp) => arr
  .filter(item => regexp.test(item[field]));

// module.exports = {
//   filterArrByFieldAndRegexp
// };