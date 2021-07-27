// Рассчитывает максимальную длину строки
const cMaxStrL = () => {
  return 50;
};

const MAX_L = cMaxStrL();

const firstHorizontCh = `=`;
const firstVerticalCh = `|`;
const secondHorizontCh = `-`;
const maxValueL = 7;       // Длина поля со значением
const confinesL = 
  + 2  // Отступ вначале
  + 3  // Разделитель между title и value
  + 2; // Завершающие символы


// Создаёт строку из символов char длины MAX_L
const mStrByCh = (char, MAX_L) => {
  let str = ``;

  for (let i = 0; i < MAX_L; i++) {
    str += char;
  }
  return str;
};

// Рассчитывает сколько нужно добавить пробелов в поле с title
const cSpTitle = (title) => {
  const l = MAX_L - title.length - maxValueL - confinesL;
  return l ? l : 1;
}

// Рассчитывает сколько нужно добавить пробелов в поле со значением
const cSpValue = (value) => {
  const l = maxValueL - String(value).length - 2; // -1 потому что при запятов в console добавляются запятые вокруг значения
  return l ? l : 1;
}

// Создаёт и показывает строку 
const sStrTitleValue = (title, value) => {
  console.log(firstVerticalCh + ` ` + title + mStrByCh(` `, cSpTitle(title))
    + ` : `,
   value, mStrByCh(` `, cSpValue(value))
    + ` ` + firstVerticalCh);

};

const mFirstHorizontalStr = () => ` ` + mStrByCh(firstHorizontCh, MAX_L - 2);
const mSecondHorizontalStr = () => ` ` + mStrByCh(secondHorizontCh, MAX_L - 2);



export const finalReport = (counts) => {
  const {
    dbBGL, dbBGFinalL,
    dbBXL, dbBXUpdatedL, dbBXRemainderL,
    countAll, countValid, countInvalid, countPerson, countCompanies,
  } = counts;

  const countLosted = countAll - countValid - countInvalid;
  const countLostedBool = Boolean(countLosted);
  const countLostedText = countLostedBool ? countLosted : `-`;

  // Расхождение
  const divergence = dbBXL - dbBXUpdatedL - dbBXRemainderL;
  const finalLosses = (countPerson - dbBGFinalL === dbBXUpdatedL) ? `-` : countPerson - dbBGFinalL;

  console.log(``);
  console.log(mFirstHorizontalStr());
  sStrTitleValue('Всего контактов Bitrix24', dbBXL);

  console.log(mSecondHorizontalStr());
  sStrTitleValue('Обновлено совпавшие с BG', dbBXUpdatedL);
  sStrTitleValue('Отпутствующие в BG', dbBXRemainderL);
  
  console.log(mSecondHorizontalStr());
  sStrTitleValue('Расхождение', divergence);
  
  console.log(mFirstHorizontalStr());
  sStrTitleValue('Всего контактов BG', dbBGL);

  console.log(mFirstHorizontalStr());
  sStrTitleValue(`Всего обработано`, countAll);

  console.log(mSecondHorizontalStr());
  sStrTitleValue(`ФЛ`, countPerson);
  sStrTitleValue(`ЮЛ`, countCompanies);
  console.log(mSecondHorizontalStr());
  sStrTitleValue(`Valid`, countValid);
  sStrTitleValue(`Invalid`, countInvalid);
  sStrTitleValue(`Потери`, countLostedText);
  console.log(mSecondHorizontalStr());

  sStrTitleValue(`Не обработано`, dbBGL - countAll);
  console.log(mFirstHorizontalStr());

  sStrTitleValue(`К загрузке из BG`, dbBGFinalL);
  sStrTitleValue(`К загрузке из BX24`, dbBXUpdatedL);
  sStrTitleValue(`Всего к загрузке`, dbBGFinalL + dbBXUpdatedL);

  console.log(mSecondHorizontalStr());
  sStrTitleValue(`Потери`, finalLosses);

  console.log(mFirstHorizontalStr());
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