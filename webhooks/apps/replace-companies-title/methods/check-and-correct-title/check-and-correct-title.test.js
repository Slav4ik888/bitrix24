const { checkAndCorrectTitle } = require('./index.js');
const mocksArr = require('./mocks.js');


describe('checkAndCorrectTitle', () => {
  mocksArr.forEach((mock => {
    it(mock.TITLE, () => {
      expect(checkAndCorrectTitle(mock).company.TITLE).toEqual(mock.RETURN);
      expect(checkAndCorrectTitle(mock).valid).toEqual(mock.RESULT);
    })
  }))
})


// npm run test check-title.test.js