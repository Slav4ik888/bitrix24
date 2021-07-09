// Возвращает названия всех полей и их значений в виде строки
export const objectFieldsToString = (obj) => {
  let str = ``;

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str += `${key}: ${obj[key]}, `;
    }
  }
  return str;
}