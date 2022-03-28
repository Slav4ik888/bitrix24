// ******************************************** //
//              DISPLAY METHODS                 //
// ******************************************** //
import { getHookByQuery } from '../get-hook-by-query/get-hook-by-query.js';


// Выводит на экран элементы списка
export const displayListHTML = (selectorContainer, selectorList, list) => {
  if (!list?.length) return null;

  selectorContainer.classList.remove(`hide`);
  list.forEach(item => selectorList.insertAdjacentHTML(`beforeEnd`, item));
};


// Вывести HOOK_QUERY.form в "hook-item-content"
export const displayHookQueryForm = (selector, target) => {
  if (!selector || !target) return null;

  const hookQuery = target.querySelector(`.hook-query`).textContent;
  const HOOK_QUERY = getHookByQuery(hookQuery);

  if (HOOK_QUERY.form) {
    selector.textContent = ``;
    selector.insertAdjacentHTML(`beforeEnd`, HOOK_QUERY.form);
  }
  return;
}
