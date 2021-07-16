/**
 * Возвращает str очищенную от наличия regexp выражения из replaceList[].f
 * @param {string} str 
 * @param {Array<{f:`regexp`, r:`replace-text`}>} replaceList 
 * @returns 
 */
export const replaceStrByRegexpArr = (str, replaceList) => {
  let replacedStr = str;

  replaceList.forEach(regexp => {
    if (regexp.f.test(replacedStr)) {
      replacedStr = replacedStr.replace(regexp.f, regexp.r);
    }
  });

  return replacedStr;
};