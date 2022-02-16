// Functions
import { displayListHTML } from './lib/display/display.js';
import toggleHook from './lib/creates/create-toggle-hook/create-toggle-hook.js';
// Consts
import hooksListArr from './lib/creates/create-hooks-list/create-hooks-list.js';


// INITIALIZE
const hooksContainer = document.querySelector(`.hooks-container`);
const hooksList = document.querySelector(`.hooks-list`);


hooksList.addEventListener(`click`, (e) => toggleHook(e.target));

// Выводим список хуков
displayListHTML(hooksContainer, hooksList, hooksListArr);

// git add . && git commit -m "add testConnectContactsWithCompanies" && git push origin master
