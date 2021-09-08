/**
 * createFieldsForCompanyAdd
 * 
 * @param {object} { TITLE, ORIGIN_ID, CREATED_BY_ID, ASSIGNED_BY_ID } 
 * @returns 
 */
export const createFieldsForCompanyAdd = ({ TITLE, ORIGIN_ID, CREATED_BY_ID, ASSIGNED_BY_ID }) => ({
  "TITLE": TITLE, // Название компании
  "ORIGIN_ID": ORIGIN_ID,
  "CREATED_BY_ID": CREATED_BY_ID,     // Кто создал 1 - Корзан Вячеслав
  "ASSIGNED_BY_ID": ASSIGNED_BY_ID
});


/**
 * createFieldsForCompanyUpdate
 * 
 * @param {object} { TITLE, CREATED_BY_ID, ASSIGNED_BY_ID } 
 * @returns 
 */
export const createFieldsForCompanyUpdate = ({ TITLE, COMMENTS, ADDRESS, PHONE: [{ VALUE: PHONE }], CREATED_BY_ID, ASSIGNED_BY_ID }) => ({
  "TITLE": TITLE, // Название компании
  "COMMENTS": COMMENTS,
  "ADDRESS": ADDRESS,
  PHONE: [{ VALUE: PHONE }],
  "CREATED_BY_ID": CREATED_BY_ID,     // Кто создал 1 - Корзан Вячеслав
  "ASSIGNED_BY_ID": ASSIGNED_BY_ID
});

  
/**
 * createFieldsForCompanyContactAdd
 * 
 * @param {number} contactId 
 * @returns {object}
 */
export const createFieldsForCompanyContactAdd = (contactId) => ({
  "CONTACT_ID": contactId, // - идентификатор контакта (обязательное поле)
  "IS_PRIMARY": "Y", // - флаг первичного контакта
});


/**
 * createFieldsForContactAdd
 * 
 * @param {object} { ADDRESS, NAME, LAST_NAME, SECOND_NAME, CREATED_BY_ID, ASSIGNED_BY_ID, PHONE: [{ VALUE: PHONE }] } 
 * @returns 
 */
export const createFieldsForContactAdd = ({ ADDRESS, NAME, LAST_NAME, SECOND_NAME,
  CREATED_BY_ID, ASSIGNED_BY_ID, PHONE: [{ VALUE: PHONE }] }) => ({
    ADDRESS,
    NAME,
    LAST_NAME,
    SECOND_NAME,
    CREATED_BY_ID,
    ASSIGNED_BY_ID,
    PHONE: [{ VALUE: PHONE }],
});
  

/**
 * Возвращает объект в виде filter: {
    "ORIGIN_ID": ORIGIN_ID,
  },
 * @param {object} { ORIGIN_ID } 
 * @returns 
 */
export const createRequestFields = ({ ORIGIN_ID }) => ({
  filter: {
    "ORIGIN_ID": ORIGIN_ID,
  },
});