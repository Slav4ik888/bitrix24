import HOOKS_QUERIES from '../../consts/hooks-queries.js';


/**
 * Возвращает объект HOOK_QUERY которому соответствует запрос query
 * 
 * @param {string} query 
 * @returns HOOKS_QUERIES[key]
 */
export const getHookByQuery = (query) => {
  
  for (let key in HOOKS_QUERIES) {
    if (Object.prototype.hasOwnProperty.call(HOOKS_QUERIES, key)) {
      if (HOOKS_QUERIES[key].description.query === query) return HOOKS_QUERIES[key];
    }
  }
  return null;
};