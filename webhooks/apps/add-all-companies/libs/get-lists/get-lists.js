
/**
 * Возвращает список названий компаний
 * @param {Array<ClientData>} arrClientData 
 * @returns {Array<string>}
 */
export const getCompanyTitleList = (arrClientData) => {
  return arrClientData.map((item) => item.TITLE);
};


/**
 * Возвращает отсортированный список названий компаний
 * @param {Array<ClientData>} arrClientData 
 * @returns {Array<string>}
 */
export const getSortedCompanyTitleList = (arrClientData) => {
  return getCompanyTitleList(arrClientData).sort();
};


/**
 * Возвращает set из массива
 * @param {Array} array
 * @returns {Set}
 */
export const getSetList = (array) => {
  let set = new Set(array);
  return set;
};


/**
 * Возвращает set названий компаний
 * @param {Array<ClientData>} arrClientData 
 * @returns {Array<string>}
 */
export const getSetCompanyTitleList = (arrClientData) => {
  return getSetList(getCompanyTitleList(arrClientData));
};


/**
 * Возвращает set населённый пунктов
 * @param {Array<ClientData>} arrClientData 
 * @returns {Set<string>}
 */
export const getSetAddressList = (arrClientData) => {
  const titleList = getCompanyTitleList(arrClientData);
  const addressList = titleList.map(title => {
    const idx = title.indexOf(`_`);
    return title.slice(0, idx + 1);
  });

  const setList = getSetList(addressList);

  // Переводим в массив
  let resultList = [];
  for (let value of setList) {
    resultList.push(value);
  }

  return resultList.sort();
};