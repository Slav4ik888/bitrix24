/**
 * Возвращает компании разделённые на 2 списка:
 *  - те кто уже есть в Битриксе
 *  - тех кого нет в Битриксе
 * 
 * @param {array} allClients
 * @param { Array<existsArr>, Array<noExistsArr> } existingClients 
 */
export const getDivededCompanies = (allClients, existingClients) => {
  let existCompanies = [];
  let noExistCompanies = [];

  allClients.forEach((client) => {
    let exist = false;

    for (let key in existingClients) {
      if (Object.prototype.hasOwnProperty.call(existingClients, key)) {
        const resFind = +existingClients[key][0].ORIGIN_ID === +client.ORIGIN_ID;
        if (resFind) {
          client.ID = existingClients[key][0].ID;
          exist = true;
        }
      }
    }
    if (!exist) noExistCompanies.push(client);
    else existCompanies.push(client);

    exist = false;
  });

  return { existCompanies, noExistCompanies };
};
