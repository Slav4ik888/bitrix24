const isEmail = (email) => {
  if (!email) return false;
  
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) {
    return true;
  } else {
    return false;
  }
};

const isEmpty = (str) => {
  if (!str || str.trim() === ``) {
    return true;
  } else {
    return false;
  }
};


// Валидация корректного метода
const validationMethod = method => {
  const availableMethods = [
    `crm.lead.add`,
    `crm.company.add`,
    // `crm.company.get`,
  ]
  let errors = {};

  if (!method || isEmpty(method)) errors.method = `Поле "method" не должно быть пустым`;
  if (!availableMethods.includes(method)) errors.method = `Данного метода нет в списке обрабатываемых`;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
};


// Валидация корректного списка комманд для batch
const validationBatchList = list => {
  let errors = {};

  if (!list?.length) errors.list = `Список команд для batch не должен быть пустым`;
  if (list.length > 50) errors.list = `Список команд для batch не должен быть > 50`;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
};
 


const validationSignupData = (data) => {
  let errors = {};
  // Проверка email
  if (isEmpty(data.email)) errors.email = `Поле email не должно быть пустым`;
  if (!isEmail(data.email)) errors.email = `Введён не корректный email`;

  // Проверка пароля
  if (isEmpty(data.password)) errors.password = `Поле пароль" не должно быть пустым`;
  if (data.password.length < 6) errors.password = `Пароль должен содержать более 6 символов`;
  if (data.password !== data.confirmPassword) errors.password = `Значение в поле подтверждение пароля, не совпадает с введёным паролем`;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
};


// Валидация для доступа к комментариям
const validationGetUserComments = (req, taskOwnerId) => {
  let errors = {};

  if (req.user.userId === taskOwnerId) {
    console.log(`Сотрудник, получает доступ к своим комментариям`);

  } else if (req.user.role === role.SUPER) {
    console.log(`Супервайзер курса, получает доступ к комментариям пользователя`);

  } else if (req.user.userId !== taskOwnerId && req.user.role !== role.SUPER) {
    console.log(`Сотрудник пытается получить доступ к комментариям другого сотрудника`);
    errors.general = `Извините, у вас недостаточно прав для доступа к комментариям другого человека`;
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  }
};


const reduceUserData = (data) => {
  let userDetails = {};

  if (!isEmpty(data.secondName.trim())) userDetails.secondName = data.secondName;
  if (!isEmpty(data.middleName.trim())) userDetails.middleName = data.middleName;

  return userDetails;
};


module.exports = {
  validationMethod,
  validationBatchList,
  validationSignupData,
  validationGetUserComments,
  reduceUserData,
  isEmpty,
};