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
  "PHONE": [{ VALUE: PHONE }],
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


/**
 * Возвращает объект для создания пользовательского поля
 * @param {string} USERFIELD_NAME
 * @returns 
 */
export const createFieldsForCompanyUserfieldsAdd = (USERFIELD_NAME) => ({
  FIELD_NAME: USERFIELD_NAME,
  USER_TYPE_ID: "string"
});



export const createFieldsForBusinessProcessList = () => ({
  select: ['ID', 'MODULE_ID', 'ENTITY', 'DOCUMENT_TYPE', 'AUTO_EXECUTE', 'NAME', 'TEMPLATE', 'PARAMETERS', 'VARIABLES', 'CONSTANTS',	'MODIFIED',	'IS_MODIFIED',	'USER_ID',	'SYSTEM_CODE']
});


export const createFieldsForBusinessProcessStart = () => ({
  TEMPLATE_ID: 189, // Id business process
  // DOCUMENT_ID: ['lists', 'BizprocDocument', `iblock_53`],
  PARAMETERS: null
});
