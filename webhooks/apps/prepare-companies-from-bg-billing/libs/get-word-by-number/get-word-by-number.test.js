const { mockGetWordNumber } = require('./mocks.js');
const { getWordByNumber } = require('./get-word-by-number.js');

describe(`get-word-by-number.js`, () => {
  mockGetWordNumber.forEach((m) => it(`getWordByNumber [${m.WORD}] num = ${m.NUM}`, () => {
    expect(getWordByNumber(m.WORD, m.NUM)).toEqual(m.RESULT);
  }));
});

// npm run test get-word-by-number.test.js
