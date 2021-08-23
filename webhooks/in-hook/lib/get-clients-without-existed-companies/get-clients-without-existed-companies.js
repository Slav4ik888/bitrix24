/**
 * Возвращает компании без тех что уже есть в Битриксе
 * get-clients-without-existed-companies
 * 
 * @param {array} allClients
 * @param {array<array<{}>>} existingClients 
 */
export const getClientsWithoutExistedCompanies = (allClients, existingClients) => {
  let arrayResult = [];

  allClients.forEach((client) => {
    let exist = false;

    for (let key in existingClients) {
      if (Object.prototype.hasOwnProperty.call(existingClients, key)) {
        const resFind = +existingClients[key][0].ORIGIN_ID === +client.ORIGIN_ID;
        if (resFind) exist = true;
      }
    }
    if (!exist) arrayResult.push(client);

    exist = false;
  });

  return arrayResult;
};
