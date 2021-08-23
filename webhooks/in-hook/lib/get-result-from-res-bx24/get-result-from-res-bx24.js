/**
 * Из ответа BX24 о созданных компаниях создаём список id
 * 
 * @param {*} res {
 *  0: {
 *    result: {
 *      result: {
 *        'crm.company.add0': 5123,
 *        'crm.company.add1': 5125,
 *        'crm.company.add2': 5127,
 *      }
 *    }
 *  }
 * @returns {array<{'field': data}>}
 */
export const getResultFromResBx24 = (res) => res[0].result.result;

