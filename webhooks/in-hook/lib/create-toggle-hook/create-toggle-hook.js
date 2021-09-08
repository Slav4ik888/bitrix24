import { displayHookQueryForm } from '../display/display.js';
import addUploadListener from '../data/add-upload-listener/index.js';
import submit from '../../controllers/submit.js';




/**
 * Открывает новый нажатый хук и закрывает предыдущий
 * и запускает ф-ю вывода формы для нажатого хука
 * 
 * @param {EventTarget} target 
 * @param {selector} openedHookContent - В данный момент открытый контент Хука
 * @param {selector} formHookSubmit - Текущая активная форма
 * @returns 
 */
const createToggleHook = () => {
  // Текущая активная форма
  let formHookSubmit;

  // В данный момент открытый контент Хука
  let openedHookContent = null;
  let openedArrow = null;

  return function (target) {
    const li = target.closest(`li`);

    if (!li) return;
    if (target.closest(`.disabled`)) return console.log(`disabled`); // Если хук закрыт
    // if (!hooksList.contains(li)) return; // Если внутри li ещё будут вложенные ul.li то убеждаемся что именно наш target

    if (target.closest(`.hook-item-header`)) { // Если нажали на header
      const currentContent = li.querySelector(`.hook-item-content`);
      const currentArrow = li.querySelector(`.toggle-arrow`);
    
      if (openedHookContent) {
        if (openedHookContent === currentContent) {
          currentContent.classList.add(`hide`);
          currentArrow.style = `transform: rotate(0deg);`;
          openedHookContent = null;
          openedArrow = null;
        }
        else {
          openedHookContent.classList.add(`hide`);
          openedArrow.style = `transform: rotate(0deg);`;

          currentContent.classList.remove(`hide`);
          currentArrow.style = `transform: rotate(90deg);`;
          openedHookContent = currentContent;
          openedArrow = currentArrow;
        }
      }
      else {
        currentContent.classList.remove(`hide`);
        currentArrow.style = `transform: rotate(90deg);`;
        openedHookContent = currentContent;
        openedArrow = currentArrow;
      }

      // Ждём как прорисуется в браузере и удаляем прошлый слушатель, а новый вешаем
      setTimeout(() => {
        formHookSubmit = document.querySelector(`.form-hook-submit`);

        formHookSubmit.removeEventListener(`submit`, submit);
        formHookSubmit.addEventListener(`submit`, submit);

        const upload = li.querySelector(`.file-upload`);
        if (upload) addUploadListener();
      }, 0);

      // Выводит форму для хука
      displayHookQueryForm(openedHookContent, li);
    }
  }
};

export default createToggleHook();
