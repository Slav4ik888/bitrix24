import { sortingArr } from './sorting-arr';
import { sortingOrderByArrIdx } from './sorting-order-by-arr-idx';
import * as m from './mocks';


describe(`SORTING.JS - sortingArr`, () => {
  it(`Сортируем по полю id`, () => {
    expect(sortingArr(m.mockArrayStart, `id`)).toEqual(m.mockArrayEndSort);
  });
});

describe(`SORTING.JS - sortingOrderByArrIdx`, () => {
  it(`Возвращает массив с обновлёнными order по возрастанию`, () => {
    expect(sortingOrderByArrIdx(m.mockArrayStart)).toEqual(m.mockArrayEndOrder);
  });
});

// describe(``, () => {
//   it(``, () => {
//     expect().toEqual();
//   });
// });

// npm run test sorting.test.js