const firstHorizontCh = `=`;
const firstVerticalCh = `|`;
const secondHorizontCh = `-`;
const maxValueL = 7;       // Длина поля со значением
const confinesL = 
  + 2  // Отступ вначале
  + 3  // Разделитель между title и value
  + 2; // Завершающие символы


// Создаёт строку из символов char длины maxL
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

// Создаёт и показывает строку 
const sStrTitleValue = (title, value, maxStrL) => {
  console.log(firstVerticalCh + ` ` + title + mStrByCh(` `, cSpTitle(title, maxStrL))
    + ` : `,
   value, mStrByCh(` `, cSpValue(value))
    + ` ` + firstVerticalCh);

};

const mFirstHorizontalStr = (MAX_L) => ` ` + mStrByCh(firstHorizontCh, MAX_L - 2);
const mSecondHorizontalStr = (MAX_L) => ` ` + mStrByCh(secondHorizontCh, MAX_L - 2);

// Рассчитывает максимальную длину строки
const cMaxStrL = () => {
  return 50;
};

export const finalReport = (counts) => {
  const { dbBGL, dbBXL, dbBXUpdatedL, dbBXRemainderL, countAll, countValid, countInvalid, countPerson, countCompanies } = counts;

  const countLosted = countAll - countValid - countInvalid;
  const countLostedBool = Boolean(countLosted);
  const countLostedText = countLostedBool ? countLosted : `-`;

  // Расхождение
  const divergence = dbBXL - dbBXUpdatedL - dbBXRemainderL;
  const MAX_L = cMaxStrL();

  console.log(``);
  console.log(mFirstHorizontalStr(MAX_L));
  sStrTitleValue('Всего контактов Bitrix24', dbBXL, MAX_L);

  console.log(mSecondHorizontalStr(MAX_L));
  sStrTitleValue('Обновлено совпавшие с BG', dbBXUpdatedL, MAX_L);
  sStrTitleValue('Отпутствующие в BG', dbBXRemainderL, MAX_L);
  
  console.log(mSecondHorizontalStr(MAX_L));
  sStrTitleValue('Расхождение', divergence, MAX_L);
  
  console.log(mFirstHorizontalStr(MAX_L));
  sStrTitleValue('Всего контактов BG', dbBGL, MAX_L);

  console.log(mFirstHorizontalStr(MAX_L));
  sStrTitleValue(`Всего обработано`, countAll, MAX_L);

  console.log(mSecondHorizontalStr(MAX_L));
  sStrTitleValue(`ФЛ`, countPerson, MAX_L);
  sStrTitleValue(`ЮЛ`, countCompanies, MAX_L);
  console.log(mSecondHorizontalStr(MAX_L));
  sStrTitleValue(`Valid`, countValid, MAX_L);
  sStrTitleValue(`Invalid`, countInvalid, MAX_L);
  sStrTitleValue(`Потери`, countLostedText, MAX_L);
  console.log(mSecondHorizontalStr(MAX_L));

  sStrTitleValue(`Не обработано`, dbBGL - countAll, MAX_L);
  console.log(mFirstHorizontalStr(MAX_L));
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