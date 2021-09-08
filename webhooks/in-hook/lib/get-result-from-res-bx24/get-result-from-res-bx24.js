/**
 * Из ответа BX24 о созданных компаниях создаём список id
 * 
 * @param {Array} res [
 *  0: {
 *    result: {
 *      result: {
 *         'crm.company.add0': 5123,
 *         'crm.company.add1': 5125,
 *         'crm.company.add2': 5127,
 *       }
 *     }
 *   }
 * ]
 * @returns {array<{'field': data}>}
 * // {
 * //   'ORIGIN_ID_1013': 5123,
 * //   'ORIGIN_ID_1014': 5125,
 * //   'ORIGIN_ID_1015': 5127,
 * // }
 */
export const getResultFromResBx24 = (res) => {
  console.log('Для обработки res: ', res);

  let arr = {};

  for (let key = 0; key < res.length; key++) {
    const objRes = res[key].result.result;
    console.log('objRes: ', objRes);

    for (let objKey in objRes) {
      if (Object.prototype.hasOwnProperty.call(objRes, objKey)) {
        arr[objKey] = objRes[objKey];
      }
    }
  }

  console.log(`ARR: `, arr);
  return arr;
}

