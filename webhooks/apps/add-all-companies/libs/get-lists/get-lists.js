
// Возвращает отсортированный список названий компаний
export const getCompanyTitleList = (data) => {
  return data.map((item) => item.TITLE);
};


// Возвращает отсортированный список названий компаний
export const getSortedCompanyTitleList = (data) => {
  return getCompanyTitleList(data).sort();
};

// Возвращает set названий компаний
export const getSetCompanyTitleList = (data) => {
  let set = new Set(getCompanyTitleList(data));
  return set;
}