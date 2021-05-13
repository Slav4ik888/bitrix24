// Возвращает true если title проходит валидацию (после _ стоит пробел)
const validateTitle = (title, idx) => {
  if (title.length === idx + 1) return true;
  if (title[idx + 1] !== ' ') return false;
  return true;
};


// return true if title validate
const checkTitle = (title) => {
  const result = {
    res: true,
    idx: -1,
  }
  if (!title) return result;

  const idx = title.indexOf(`_`);

  if (idx !== -1) {
    if (!validateTitle(title, idx)) { // Не валидный
      result.res = false;
      result.idx = idx;
    }
  }

  return result;
};

// Возвращает скорректированный title
const correctTitle = (title, idx) => title.slice(0, idx + 1) + ` ` + title.slice(idx + 1);

/**
 * 
 * @param {Object} obj { ID: "4491", TITLE: "СпецМос_ГорСтрой" }
 * @return {Object<valid: result.res, company> }
 */
const checkAndCorrectTitle = (_company) => {
  const company = Object.assign({}, _company);
  const result = checkTitle(company.TITLE);

  if (!result.res) { // incorrect title
    company.TITLE = correctTitle(company.TITLE, result.idx);
  }
  return { valid: result.res, company };
};

// console.log(`result :`, checkAndCorrectTitle({ ID: "4490", TITLE: "Спец_МосГорСтрой" }));

module.exports = {
  checkAndCorrectTitle,
}