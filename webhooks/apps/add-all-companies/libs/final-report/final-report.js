const firstHorizontCh = `=`;
const firstVerticalCh = `|`;
const secondHorizontCh = `-`;
const maxValueL = 7;       // Длина поля со значением
const confinesL = 
  + 2  // Отступ вначале
  + 3  // Разделитель между title и value
  + 2; // Завершающие символы


const mStrByCh = (char, maxL) => {
  let str = ``;

  for (let i = 0; i < maxL; i++) {
    str += char;
  }
  return str;
};

// Рассчитывает сколько нужно добавить пробелов в поле с title
const cSpTitle = (title, maxStrL) => {
  const l = maxStrL - title.length - maxValueL - confinesL;
  return l ? l : 1;
}

// Рассчитывает сколько нужно добавить пробелов в поле со значением
const cSpValue = (value) => {
  const l = maxValueL - String(value).length - 2; // -1 потому что при запятов в console добавляются запятые вокруг значения
  return l ? l : 1;
}

// Создаёт строку 
const sStrTitleValue = (title, value, maxStrL) => {
  console.log(firstVerticalCh + ` ` + title + mStrByCh(` `, cSpTitle(title, maxStrL))
    + ` : `,
   value, mStrByCh(` `, cSpValue(value))
    + ` ` + firstVerticalCh);

};

const mFirstHorizontalStr = (MAX_LENGTH) => ` ` + mStrByCh(firstHorizontCh, MAX_LENGTH - 2);
const mSecondHorizontalStr = (MAX_LENGTH) => ` ` + mStrByCh(secondHorizontCh, MAX_LENGTH - 2);

// Рассчитывает максимальную длину строки
const cMaxStrL = () => {
  return 40;
};

export const finalReport = (dbLength, counts) => {
  const { countAll, countValid, countInvalid, countPerson, countCompanies } = counts;

  const countLosted = countAll - countValid - countInvalid;
  const countLostedBool = Boolean(countLosted);
  const countLostedText = countLostedBool ? countLosted : `-`;

  const MAX_LENGTH = cMaxStrL();

  console.log(``);
  console.log(mFirstHorizontalStr(MAX_LENGTH));
  sStrTitleValue('Всего контактов', dbLength, MAX_LENGTH);

  console.log(mFirstHorizontalStr(MAX_LENGTH));
  sStrTitleValue(`Всего обработано`, countAll, MAX_LENGTH);

  console.log(mSecondHorizontalStr(MAX_LENGTH));
  sStrTitleValue(`ФЛ`, countPerson, MAX_LENGTH);
  sStrTitleValue(`ЮЛ`, countCompanies, MAX_LENGTH);
  console.log(mSecondHorizontalStr(MAX_LENGTH));
  sStrTitleValue(`Valid`, countValid, MAX_LENGTH);
  sStrTitleValue(`Invalid`, countInvalid, MAX_LENGTH);
  sStrTitleValue(`Потери`, countLostedText, MAX_LENGTH);
  console.log(mSecondHorizontalStr(MAX_LENGTH));

  sStrTitleValue(`Не обработано`, dbLength - countAll, MAX_LENGTH);
  console.log(mFirstHorizontalStr(MAX_LENGTH));
  console.log(``);
};
//     -+++++=        .+++++=
//     .+@@@@@+       #@@@@*:
//       .@@@@@=     *@@@@@  
//        @+@@@@-   =#@@@@@  
//        @ +@@@@: :% @@@@@  
//        @  *@@@@-%: @@@@@  
//        @   *@@@@-  @@@@@  
//       -@-   #@@+  :@@@@@: 
//     -#@@@#-  ##  =@@@@@@@=
//     .......      .........