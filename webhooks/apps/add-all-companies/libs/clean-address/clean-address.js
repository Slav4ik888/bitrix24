import filter from './rules.js';


// Возвращает первое слово (населённый пункт), остальные не нужны
export const getOneFirstWord = (address) => {
  const wet = address.split(/\s/g);
  let result = wet.find((w) => Boolean(w));
  return result || ``;
};


// Очищаем address от с. д. и прочего
export const cleanAddress = (address) => {
  let cleanedAddress = address ? address : ``;

  filter.forEach(regexp => {
    if (regexp.f.test(cleanedAddress)) {
      cleanedAddress = cleanedAddress.replace(regexp.f, regexp.r);
    }
  });
  
  // Удаляем то, что после первого слова
  cleanedAddress = getOneFirstWord(cleanedAddress);

  // Удаляем пробелы
  cleanedAddress = cleanedAddress.replace(/\s/g, ``);

  cleanedAddress += `_ `;
  
  return cleanedAddress;
}