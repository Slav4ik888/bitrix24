const { CONSTS } = require('./consts');
const { getRandomNumber } = require('./random/random');

const url1 = "TITLE=Test%20lead%20by%20robot%20naaaahhhh&CREATED_BY_ID=1&ASSIGNED_BY_ID=1&PHONE=%5Bobject%20Object%5D&EMAIL=%5Bobject%20Object%5D&COMMENTS=%D0%9A%D0%B0%D0%BA%D0%BE%D0%B9-%D1%82%D0%BE%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B9%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D1%8B%20%D0%B4%D0%B5%D0%BB%D0%B0!";
const url2 = "fields[TITLE]=Test%20lead%20by%20robot%20naaaahhhh&fields[CREATED_BY_ID]=2";


module.exports = {
  fieldForCompany: {
    "TITLE": `Готол_${getRandomNumber(10, 99)} Иванько Семён Семёныч`, // Название компании
    "ORIGIN_ID": "10",
    "CREATED_BY_ID": CONSTS.CREATED_BY_ID, // Кто создал 1 - Корзан Вячеслав
    "ASSIGNED_BY_ID": CONSTS.ASSIGNED_BY_ID, // Назначенный ответственный
    "PHONE": [{ "VALUE": "+79501197000" }],
    "EMAIL": [{ "VALUE": "korzan.va@mail.ru" }],
  },

  fieldForLead: {
    "TITLE": `Test lead by robot nah`, // Название лида
    "CREATED_BY_ID": CONSTS.CREATED_BY_ID, // Кто создал 1 - Корзан Вячеслав
    "ASSIGNED_BY_ID": CONSTS.ASSIGNED_BY_ID, // Назначенный ответственный
    "PHONE": [{ "VALUE": "+79501197777" }],
    "EMAIL": [{ "VALUE": "korzanaaaava@mail.ru" }],
    "COMMENTS": "Какой-то комментарий для пользы дела!",
  },

  commands: [
    "fields[TITLE]=Test1 company by robot naaaahhhh&fields[CREATED_BY_ID]=1&fields[ORIGIN_ID]=10",
    "fields[TITLE]=Test2 company by robot naaaahhhh&fields[CREATED_BY_ID]=1&fields[ORIGIN_ID]=11",
    "fields[TITLE]=Test3 company by robot naaaahhhh&fields[CREATED_BY_ID]=1&fields[ORIGIN_ID]=12",
    "fields[TITLE]=Test4 company by robot naaaahhhh&fields[CREATED_BY_ID]=1&fields[ORIGIN_ID]=13",
    "fields[TITLE]=Test5 company by robot naaaahhhh&fields[CREATED_BY_ID]=1&fields[ORIGIN_ID]=14",
    "fields[TITLE]=Test6 company by robot naaaahhhh&fields[CREATED_BY_ID]=1&fields[ORIGIN_ID]=15",
    "fields[TITLE]=Test7 company by robot naaaahhhh&fields[CREATED_BY_ID]=1&fields[ORIGIN_ID]=16",
    "fields[TITLE]=Test8 company by robot naaaahhhh&fields[CREATED_BY_ID]=1&fields[ORIGIN_ID]=17",
  ],
  companyList: [
    "fields["
  ],
  fieldsUpdate: {
    "TITLE": "Test updated company Name",
    "PHONE": [{ "VALUE": "+79501197777" }],
    "COMMENTS": "Какой-то комментарий для пользы дела!",
  }
};