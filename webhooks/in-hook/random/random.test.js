import * as r from './random';

const mockArray = [
  {id: `1`},
  {id: `2`},
  {id: `3`},
  {id: `4`},
];

describe(`RANDOM.JS`, () => {
  it(`getMixedArray - empty array`, () => {
    expect(r.getMixedArray([])).toEqual([]);
  });

});

// npm run test random.test.js