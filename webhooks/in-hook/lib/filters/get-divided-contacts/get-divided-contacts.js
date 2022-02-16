/**
 * Возвращает контакты разделённые на 2 списка:
 *  - те кто уже есть в Битриксе
 *  - тех кого нет в Битриксе
 * 
 * @param {array} allClients
 * @param {array} existingContacts 
 */
export const getDivededContacts = (allClients, existingContacts) => {
  let existContacts = [];
  let noExistContacts = [];

  allClients.forEach((client) => {
    let exist = false;
    const contact = Object.assign({}, client.CONTACT);

    for (let key in existingContacts) {
      if (Object.prototype.hasOwnProperty.call(existingContacts, key)) {
        const resFind = +existingContacts[key][0].ORIGIN_ID === +contact.ORIGIN_ID;
        if (resFind) {
          contact.ID = existingContacts[key][0].ID;
          exist = true;
        }
      }
    }
    if (!exist) noExistContacts.push(contact);
    else existContacts.push(contact);

    exist = false;
  });

  
  return { existContacts, noExistContacts };
};
