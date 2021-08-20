
// Возвращает `` если str пусто | undefined | Error
const getValidValue = (str) => str ? str : ``;

  
/**
 * Разделяет строку содержащую "Фамилия Имя Отчество" на составляющие
 * 
 * @param {string} fullname 
 * @returns { LAST_NAME, NAME, SECOND_NAME }
 */
export const getFio = (fullname) => {
  const peaces = fullname ? fullname.split(` `) : [``, ``, ``];

  const LAST_NAME = getValidValue(peaces[0]);   // Фамилия
  const NAME = getValidValue(peaces[1]);        // Имя
  const SECOND_NAME = getValidValue(peaces[2]); // Отчество

  return { LAST_NAME, NAME, SECOND_NAME };
};

// console.log(`getFio: `, getFio(`Шарыпова Светлана Владимировна`));
// console.log(`getFio: `, getFio(`Шарыпова Светлана`));
// console.log(`getFio: `, getFio());
