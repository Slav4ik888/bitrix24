// Возвращает длину объекта (кол-во элементов)
export const objectLength = arData => {
  let result = 0;
  for (let key in arData) result++;

  return result;
};