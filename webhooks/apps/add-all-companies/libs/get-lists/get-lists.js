
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
 * Возвращает массив созданный из списка (псевдомассива), с добавлением id в виде key от списка
 * @param {Object} list 
 * @returns {Array}
 */
export const getArrayFromList = list => {
  let arr = [];
  for (let key in list) {
    let obj = {};
    obj = cloneObj(list[key]);
    obj.id = key;
    arr.push(obj);
  }
  return arr;
};


/**
 * Возвращает массив уникальных населённый пунктов
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

  return getArrayFromList(setList).sort();
};