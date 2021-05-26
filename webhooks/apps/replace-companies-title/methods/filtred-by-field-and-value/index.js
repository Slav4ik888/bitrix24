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
  const newCompany = Object.assign({}, companyData);

  // Проверяем есть ли флаг * в заменяемом
  const idxStarReplaceValue = replaceValue.indexOf(`*`);
  if (idxStarReplaceValue !== -1) {
    replaceValue = replaceValue.slice(0, idxStarReplaceValue);

    // Теперь обрабатываем findValue
    const idxStarFindValue = findValue.indexOf(`*`);
    if (idxStarFindValue !== -1) {
      findValue = findValue.slice(0, idxStarFindValue);
    }
  }

  const findValueRegExp = createRegExpByValue(findValue);
  newCompany[field] = newCompany[field].replace(findValueRegExp, replaceValue);
  return newCompany;
};


// Возвращает объект компании с изменённым TITLE
const checkAndCorrectTitle = (companyData, findValue, replaceValue) => {
  return checkAndCorrectField(companyData, `TITLE`, findValue, replaceValue);
};

const checkAndCorrectTitles = (companiesData, findValue, replaceValue) => {
  let corretedCompanies = [];
  companiesData.forEach(company => {
    const corrected = checkAndCorrectTitle(company, findValue, replaceValue);
    console.log('corrected: ', corrected);
    corretedCompanies.push(corrected);
  });
  return corretedCompanies;
};

module.exports = {
  filtredByFieldAndRegexp,
  createRegExpByValue,
  checkAndCorrectTitle,
  checkAndCorrectField,
  checkAndCorrectTitles,
};