import { getFirstWord } from '../../get-word-by-number/get-word-by-number.js';
import { replaceStrByRegexpArr } from '../../replace-str-by-regexp-arr/replace-str-by-regexp-arr.js';
import filter from './rules.js';


// Очищаем address от с. д. и прочего, оставляет только название населённого пункта
export const getLocality = (address) => {
  let cleanedAddress = address ? address : ``;

  // Лишнее удаляем, на нужное меняем 
  cleanedAddress = replaceStrByRegexpArr(cleanedAddress, filter);

  // Удаляем то, что после первого слова
  cleanedAddress = getFirstWord(cleanedAddress);

  // Удаляем пробелы
  cleanedAddress = cleanedAddress.replace(/\s/g, ``);

  // Чтобы посмотреть какие именно адреса подподают под выбранное условие
  // if (/нп/.test(cleanedAddress)) console.log(1111, cleanedAddress, ` - `, address);
  
  return cleanedAddress;
}