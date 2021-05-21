const { checkAndCorrectTitle } = require('./index.js');
const mocksArr = require('./mocks.js');


describe('checkAndCorrectTitle', () => {
  mocksArr.forEach((mock => {
    it(mock.TITLE, () => {
      expect(checkAndCorrectTitle(mock, `_`, `_ `).company.TITLE).toEqual(mock.RETURN);
      expect(checkAndCorrectTitle(mock, `_`, `_ `).valid).toEqual(mock.RESULT);
    })
  }))
})


// npm run test check-and-correct-title.test.js