/**
 * 
 * @param {string} phones // такой формат "[[\"+7-950-063-1970\", \"\"]]"
 * @returns 
 */
export const getPhones = (phones) => {
  let updatedPhones = [];

  if (!phones) return updatedPhones;

  let cleaned = phones .replace(/\[/g, "");
  cleaned     = cleaned.replace(/\]/g, "");
  cleaned     = cleaned.replace(/\"/g, "");

  let arrPhones = cleaned.split(",");

  arrPhones.forEach((item, i) => {
    if (i === 0 || i === 2) {
      const phone = { VALUE: item }
      updatedPhones.push(phone);
    }
  });

  return updatedPhones;
  // [{ VALUE: client?.phone || null }];
};