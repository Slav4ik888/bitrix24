import { getFirstWord } from '../get-word-by-number/get-word-by-number.js';
import filter from './rules.js';



// Очищаем address от с. д. и прочего
export const cleanAddress = (address) => {
  let cleanedAddress = address ? address : ``;

  filter.forEach(regexp => {
    if (regexp.f.test(cleanedAddress)) {
      // if (/заимка/.test(cleanedAddress)) console.log(1111, cleanedAddress, ` - `, address);
      cleanedAddress = cleanedAddress.replace(regexp.f, regexp.r);
      // return // при нахождении совпадений, поиск прекращаем
    }
  });
  
  // Удаляем то, что после первого слова
  cleanedAddress = getFirstWord(cleanedAddress);

  // Удаляем пробелы
  cleanedAddress = cleanedAddress.replace(/\s/g, ``);

  cleanedAddress += `_ `;

  // Чтобы посмотреть какие именно адреса подподают под выбранное условие
  // if (/нп/.test(cleanedAddress)) console.log(1111, cleanedAddress, ` - `, address);
  
  return cleanedAddress;
}