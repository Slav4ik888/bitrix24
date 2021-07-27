import { getFirstWord, getSecondWord, getThirdWord, getFourthWord } from '../get-word-by-number/get-word-by-number.js';
import { getSetList } from '../get-lists/get-lists.js';
import { getItemFromArrByField } from '../../utils/arrays/get-item-from-arr-by-field/get-item-from-arr-by-field.js';


// Очищаем слово от лишних символов и переводим в нижний регистр
export const cleanText = (text) => {
  if (text) return text.replace(/_/g, ``).toLowerCase();
  return ``;
};

// Сравниваем 2 значения
export const checkConsilience = (a, b) => cleanText(a) === cleanText(b);

// Совпадение по населённому пункту
export const checkConsilienceAddress = (addressBX, addressBG) => checkConsilience(addressBX, addressBG);
// console.log(checkConsilienceAddress(`Каменка_`, `Тыргетуй_`)); // false
// console.log(checkConsilienceAddress(`Каменка_`, `Каменка_`)); // true

export const checkConsilienceName = (nameBX, nameBG) => checkConsilience(nameBX, nameBG);


/**
 * Возвращает массив оставшихся элементов в oldArr которых нет в newArr
 * 
 * @param {Array} newArr 
 * @param {Array} oldArr 
 * @param {string} field поле по которому производить сравнение
 * @returns {Array} from oldArr del newArr
 */
export const getRemainderArr = (newArr, oldArr, field) => {
  let remainderArr = [];

  oldArr.forEach((item) => {
    const is = newArr.find(it => it[field] === item[field]);
    if (!is) remainderArr.push(item);
  });

  return remainderArr;
};

// Проверяет был ли сохранён дубликат
const isDouble = (db, item) => getItemFromArrByField(db, `ID`, item);

/**
 * Каждый адрес BX сравниваем с BG если находим, то сравниваем на совпадение фамилии
 * @param {array} DB_BX 
 * @param {array} DB_BG 
 * @returns пока не знаю
 */
export const findConsilience = (DB_BX, DB_BG) => {
  let DB_BX_UPDATED = [];

  DB_BX.forEach((itemBX, i) => {
    const addressBX = getFirstWord(itemBX.TITLE); // Отделяем первое слово - Населённый пункт

    DB_BG.forEach((itemBG) => {
      const addressBG = getFirstWord(itemBG.TITLE); // Отделяем первое слово - Населённый пункт

      if (checkConsilienceAddress(addressBG, addressBX)) {
        const secondNameBX = getSecondWord(itemBX.TITLE);
        const secondNameBG = getSecondWord(itemBG.TITLE);

        // Проверяем совпадение по Фамилии
        if (checkConsilienceName(secondNameBX, secondNameBG)) {

          const thirdNameBX = getThirdWord(itemBX.TITLE);
          const thirdNameBG = getThirdWord(itemBG.TITLE);

          // Проверяем совпадение по Имени
          if (checkConsilienceName(thirdNameBX, thirdNameBG)) {
            const fourthNameBX = getFourthWord(itemBX.TITLE);
            const fourthNameBG = getFourthWord(itemBG.TITLE);

            // Проверяем совпадение по Отчеству
            if (checkConsilienceName(fourthNameBX, fourthNameBG)) {
              // Обновляем нужными полями контакт из Битрикс24 для последующего обновления им в Битрикс24
              const updatedItemBX = Object.assign({}, itemBX, itemBG);

              // Проверяем есть ли такой же уже сохранённый контакт (полный однофамилец)
              if (!isDouble(DB_BX_UPDATED, updatedItemBX)) {
                DB_BX_UPDATED.push(updatedItemBX);
                console.log(itemBX.TITLE, ` = `, itemBG.TITLE);
              }
            }
          }
        }
      }
      

    });
  });

  const DB_BX_REMAINDER = getRemainderArr(DB_BX_UPDATED, DB_BX, `ID`);

  return { DB_BX_UPDATED, DB_BX_REMAINDER };
};
