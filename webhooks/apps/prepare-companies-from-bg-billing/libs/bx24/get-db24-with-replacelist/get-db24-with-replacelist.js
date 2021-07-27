import { replaceStrByRegexpArr } from '../../replace-str-by-regexp-arr/replace-str-by-regexp-arr.js';
import rules from './rules.js';


// Проверяет есть ли в TITLE значения из rules и меняет их на нужное
export const getDB24WithReplacelist = (db) => {
  let updated = [];

  db.forEach((item) => {
    const newObj = Object.assign({}, item);
    newObj.TITLE = replaceStrByRegexpArr(item.TITLE, rules);
    updated.push(newObj);
  });

  return updated;
};