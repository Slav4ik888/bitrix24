// Счётчик подсчёта времени
export function createTimer() {
  function timer(type) {
    timer.calls.push({ type, time: new Date() / 1000 });
  }

  timer.calls = [];
  return timer;
};

// Добавляет пробелы и возвращает строку заданной длины
const createAddSpace = (l) => {
  let L = l;

  return function (str) {
    let newStr = str;
    let lack = L - str.length;
    if (lack > 0) {
      for (let i = 0; i < lack - 1 ; i++) {
        newStr += ` `;
      }
      newStr += `: `;
    }
    return newStr;
  }
};

const addSpace = createAddSpace(17);

// Вывести списком все значения таймера
export const showTimer = (arr) => {
  arr.forEach((item => console.log(addSpace(item.type) + item.time)))
};