import { replaceStrByRegexpArr } from '../../replace-str-by-regexp-arr/replace-str-by-regexp-arr.js';
import rules from './rules.js';

// Проверяем и очищаем fio
export const cleanFio = (fio) => {
  if (!fio) return ``;
  // Лишнее удаляем, на нужное меняем 
  return replaceStrByRegexpArr(fio, rules);
}