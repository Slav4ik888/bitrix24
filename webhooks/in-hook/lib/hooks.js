import { HOOK_QUERIES } from '../consts.js';


// Возвращает список хуков оформленных в items
const createHookList = (hooks) => {
  let list = [];

  let id = 1;

  for (let key in hooks) {
    if (Object.prototype.hasOwnProperty.call(hooks, key)) {
      const { description: { title, query } } = hooks[key];
      const item = `
        <li class="hook-item-container">

          <div class="hook-item-header">
            <div class="hook-item-main">
              <div class="hook-title">${title}</div>
              <span>:</span>
              <div class="hook-query">${query}</div>
            </div>

            <div class="wrap-toogle-arrow">
              <div id="${id}" class="toggle-arrow hook-toggle-icon">
                <div class="toggle-arrow-icon"></div>
              </div>
            </div>
          </div>

          <div class="hook-item-content hide">
          </div>
        </li>
      `;

      id++;
      list.push(item);
    }
  }

  return list;
};

export default createHookList(HOOK_QUERIES);