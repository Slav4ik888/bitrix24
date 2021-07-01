/**
 * Сортируем по arr по полю fieldName
 * @param {array} arr 
 * @param {string} fieldName 
 * 
 * @return {array} - result
 */
export const sortingArr = (arr, fieldName) => { // test +++
  let result = [];
  result = result.concat(arr);
  
  return result.sort((a, b) => {
    if (a[fieldName] < b[fieldName]) {
      return -1;
    }
    if (a[fieldName] > b[fieldName]) {
      return 1;
    }
    return 0;
  }); 
};