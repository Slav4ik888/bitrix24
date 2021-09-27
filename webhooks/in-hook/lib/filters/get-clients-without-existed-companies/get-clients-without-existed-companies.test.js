const { getClientsWithoutExistedCompanies } = require('./get-clients-without-existed-companies.js');
const { mockArray, mockWithData, mockArrayWithoutItem } = require('./mocks.js');


describe(`getClientsWithoutExistedCompanies`, () => {
  it(`getClientsWithoutExistedCompanies`, () => {
    expect(getClientsWithoutExistedCompanies(mockArray, mockWithData)).toEqual(mockArrayWithoutItem);
  });

});


// npm run test removed-existing-clients.test.js