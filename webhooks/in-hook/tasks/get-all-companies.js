const { createReadStream, createWriteStream } = require('fs');
const path = require('path');

const FILE_NAME = path.resolve(process.cwd(), 'data/companies.txt');

// const readStream = createReadStream();
// readStream.once(`end`, () => {
//   console.log(`Stream завершён.`);
//   res.end();
// });
// readStream.once(`close`, () => {
//   console.log(`Stream closed`);
// });

const writeStream = createWriteStream(FILE_NAME, { flags: "a" });

writeStream.on('finish', () => console.log(`Finished writeStream.`));
writeStream.once(`close`, () => console.log(`writeStream closed`));
writeStream.on('error', (err) => console.log(err))

const { crmCompanyList } = require('../controllers/methods');



module.exports = async function getAllCompanies() {
  const params = {
    filter: { "OPENED": "Y" },
    select: ["ID", "TITLE", "ORIGIN_ID", "CREATED_BY_ID", "ASSIGNED_BY_ID"]
  };

  const result = await crmCompanyList(params);
  console.log('res crmCompanyList: ', result);

  writeStream.write(result);
  // writeStream.write(JSON.stringify(result, null, 2));

  // result.forEach((company) => {
  //   writeStream.write(JSON.stringify(company, null, 2))
  //   writeStream.write(", \n");
  // });
  // writeStream.write("] \n");
  
  writeStream.end();
};

