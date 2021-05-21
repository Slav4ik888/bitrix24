
/**
 * Возвращает отфильтрованный массив по полю и значению
 * @param {Array} arr 
 * @param {String} field
 * @param {String} regexp
 * @return {Array}
 */
exports.filtredByFieldAndValue = (arr, field, regexp) => arr.filter(item => regexp.test(item[field]));