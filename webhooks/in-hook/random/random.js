/**
 * Выбор случайного числа в заданном промежутке
 * @param {Number} min - Минимальное допустимое значение (включительно)
 * @param {Number} max - Максимальное допустимое значение (включительно)
 * @return {Number} Случайное целое число в данном промежутке
 */
module.exports.getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Возвращает случайную букву англ алфавита
 * @return {string}
 */
module.exports.getRandomEngLitera = () => {
  const eng = [`a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`, `j`, `k`, `l`, `m`, `n`, `o`, `p`, `q`, `r`, `s`, `t`, `u`, `v`, `w`, `x`, `y`, `z`];

  return eng[getRandomNumber(0, 25)];
};


/**
 * Выбор случайного элемента массива
 * @param {Array} array
 * @return {Any} Случайный элемент массива
 */
module.exports.getRandomElement = (array) => {
  const randomIndex = getRandomNumber(0, array.length - 1);
  return array[randomIndex];
};

/**
 * Генерация случайного значения true\false
 * @return {Boolean}
 */
module.exports.getRandomBoolean = () => {
  return Boolean(getRandomNumber(0, 1));
};

/**
 * Возвращает перемешанный массив в случайном порядке
 * @param {Array} arr
 * @return {Array}
 */
module.exports.getMixedArray = (arr) => {
  let newArr = [];
  let randomIdx;

  while (arr && arr.length) {
    randomIdx = getRandomNumber(0, arr.length - 1);
    newArr.push(arr[randomIdx]);
    arr = [...arr.slice(0, randomIdx), ...arr.slice(randomIdx + 1)];
  }

  return newArr;
};
