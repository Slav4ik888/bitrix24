/**
 * Возвращает слово под № num
 * @param {string} word строка где слова разделены пробелом
 * @param {number} num от 0, как в массиве
 */
export const getWordByNumber = (word, num) => {
  if (!word) return ``;
  if (num === undefined) return ``;

  const wordArr = word.split(/\s/g);

  // Удаляем пустые ячейки
  const cleanedArr = [];
  wordArr.forEach((word) => {
    if (word) cleanedArr.push(word)
  });

  return cleanedArr[num];
};

// Возвращает первое слово (населённый пункт), остальные не нужны
export const getFirstWord = (word) => getWordByNumber(word, 0);
export const getSecondWord = (word) => getWordByNumber(word, 1);
export const getThirdWord = (word) => getWordByNumber(word, 2);
export const getFourthWord = (word) => getWordByNumber(word, 3);

// module.exports = {
//   getWordByNumber,
//   getFirstWord,
//   getSecondWord,
//   getThirdWord,
// };