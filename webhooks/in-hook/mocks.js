const { CONSTS } = require('./consts');
const { getRandomNumber } = require('./random/random');


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
  fieldsUpdate: {
    "TITLE": "Test updated company Name",
    "PHONE": [{ "VALUE": "+79501197777" }],
    "COMMENTS": "Какой-то комментарий для пользы дела!",
  }
};