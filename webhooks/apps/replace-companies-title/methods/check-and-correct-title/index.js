/**
 * Возвращает true если title проходит валидацию (после искомого значения стоит пробел)
 * @param {String} title 
 * @param {String} findValue 
 * @param {Number} idx 
 * @return {Boolean} 
 */
const validateLastSpace = (title, findValue, idx) => {
  // If end of string
  if (title.length === (idx + findValue.length)) return true;
  
  if (title[idx + findValue.length] !== ' ') return false;
  return true;
};



/**
 * return true if title validate
 * @param {String} title 
 * @param {String} findValue 
 * @return {Boolean}
 */
const checkTitle = (title, findValue) => {
  const result = {
    res: true,
    idx: -1,
  }
  if (!title) return result;

  const idx = title.indexOf(findValue);

  if (idx !== -1) {
    if (!validateLastSpace(title, findValue, idx)) { // Не валидный
      result.res = false;
      result.idx = idx;
    }
  }

  return result;
};



// Возвращает скорректированный title
const correctTitle = (title, idx, replaceValue) => title.slice(0, idx)
  + replaceValue
  + title.slice(idx + replaceValue.length - 1);



/**
 * Возвращает объект ввиде результата и обновлённое значение
 * @param {Object} _companyData { ID: "4491", TITLE: "СпецМос_ГорСтрой" }
 * @param {String} findValue искомое значение
 * @param {String} replaceValue
 * @return {Object<valid: result.res, companyData> }
 */
const checkAndCorrectTitle = (_companyData, findValue, replaceValue) => {
  const companyData = Object.assign({}, _companyData);
  const result = checkTitle(companyData.TITLE, findValue);

  if (!result.res) { // incorrect title
    companyData.TITLE = correctTitle(companyData.TITLE, result.idx, replaceValue);
  }
  return { valid: result.res, companyData };
};

// console.log(`result :`, checkAndCorrectTitle({ ID: "4490", TITLE: "Спец_МосГорСтрой" }));



module.exports = {
  checkAndCorrectTitle,
}