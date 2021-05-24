// Преобразуем введённое пользователем значение и создаём регулярное выражениее
const createRegExpByValue = (value) => {
  const nextLetter = `\\p{L}`; // Следующая идёт только буква
  const nextDigit = `\\d`;     // Следующая идёт только цифрв

  const changedWithLetter = value.replace(/\*/g, nextLetter);
  const changedWithDigit = changedWithLetter.replace(/\^/g, nextDigit)

  const regexp = new RegExp(`${changedWithDigit}`, `iu`);
  // console.log('regexp: ', regexp);
  return regexp;
};


/**
 * Возвращает отфильтрованный массив по полю и значению
 * @param {Array} arr - список компаний
 * @param {String} field - поле по которому фильтровать
 * @param {String} regexp - значение которое прислал пользователь
 */
const filtredByFieldAndRegexp = (arr, field, regexp) => arr.filter(item => regexp.test(item[field]));


/**
 * Возвращает объект компании с изменённым полем
 * @param {Object} companyData { ID: "4491", TITLE: "СпецМос_ГорСтрой" }
 * @param {String} field поле с которым нужно произвести операцию
 * @param {String} findValue искомое значение
 * @param {String} replaceValue
 * @return {Object<valid: result.res, companyData> }
 */
const checkAndCorrectField = (companyData, field, findValue, replaceValue) => {
  const findValueRegExp = createRegExpByValue(findValue);
  return companyData[field] = companyData[field].replace(findValueRegExp, replaceValue);
};


// Возвращает объект компании с изменённым TITLE
const checkAndCorrectTitle = (companyData, findValueRegExp, replaceValue) => {
  return checkAndCorrectField(companyData, `TITLE`, findValueRegExp, replaceValue);
};


module.exports = {
  filtredByFieldAndRegexp, createRegExpByValue, checkAndCorrectTitle, checkAndCorrectField,
};