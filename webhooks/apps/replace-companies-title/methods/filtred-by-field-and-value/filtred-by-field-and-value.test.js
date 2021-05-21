const { filtredByFieldAndValue } = require('./index.js');
const m = require('./mocks.js');


describe('filtredByFieldAndValue', () => {

  it(`mocksBefore 1`, () => {
    expect(filtredByFieldAndValue(m.mocksBefore, `TITLE`, m.value1)).toEqual(m.mocksAfter1);
  });
  it(`mocksBefore 2`, () => {
    expect(filtredByFieldAndValue(m.mocksBefore, `TITLE`, m.value2)).toEqual(m.mocksAfter2);
  });
  it(`mocksBefore 3`, () => {
    expect(filtredByFieldAndValue(m.mocksBefore, `TITLE`, m.value3)).toEqual(m.mocksAfter3);
  });
  it(`mocksBefore 4`, () => {
    expect(filtredByFieldAndValue(m.mocksBefore, `TITLE`, m.value4)).toEqual(m.mocksAfter4);
  });

})


// npm run test filtred-by-field-and-value.test.js