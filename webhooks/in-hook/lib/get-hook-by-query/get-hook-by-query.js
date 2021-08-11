import { HOOK_QUERIES } from '../../consts.js';


/**
 * Возвращает объект HOOK_QUERY которому соответствует запрос query
 * 
 * @param {string} query 
 * @returns HOOK_QUERIES[key]
 */
export const getHookByQuery = (query) => {
  
  for (let key in HOOK_QUERIES) {
    if (Object.prototype.hasOwnProperty.call(HOOK_QUERIES, key)) {
      if (HOOK_QUERIES[key].description.query === query) return HOOK_QUERIES[key];
    }
  }
  return null;
};