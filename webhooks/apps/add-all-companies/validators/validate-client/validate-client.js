
export const validateClient = (client) => {
  let errors = {};

  // if (client.org) {
  //   errors.org = `Это компания`;
  // };

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
};