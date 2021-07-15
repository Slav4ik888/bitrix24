const { filterArrByFieldAndRegexp } = require('./filter-arr-by-field-and-regexp.js');
const m = require('./mocks.js');


describe('filterArrByFieldAndRegexp', () => {

  it(`mocksBefore 1`, () => {
    expect(filterArrByFieldAndRegexp(m.ARR, `TITLE`, m.VALUE)).toEqual(m.RESULT);
  });
});


// npm run test filter-arr-by-field-and-regexp.test.js