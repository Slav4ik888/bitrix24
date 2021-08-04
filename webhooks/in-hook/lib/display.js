// ******************************************** //
//              DISPLAY METHODS                 //
// ******************************************** //

// Выводит на экран элементы списка
export const displayListHTML = (selectorContainer, selectorList, list) => {
  if (!list?.length) return null;

  selectorContainer.classList.remove(`hide`);
  list.forEach(item => selectorList.insertAdjacentHTML(`beforeEnd`, item));
};