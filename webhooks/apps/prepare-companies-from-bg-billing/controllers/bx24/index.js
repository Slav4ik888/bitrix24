import { getListFromJSON } from '../../libs/files/get-list-from-json/get-list-from-json.js';
import { getDB24WithoutTrashlist } from '../../libs/bx24/clean-db-from-bitrix24/clean-db-from-bitrix24.js';
import { getDB24WithReplacelist } from '../../libs/bx24/get-db24-with-replacelist/get-db24-with-replacelist.js';
import { filterArrByFieldAndRegexp } from '../../libs/filters/filter-arr-by-field-and-regexp/filter-arr-by-field-and-regexp.js';
import { sortingArr } from '../../utils/sorting/sorting-arr.js';

const bx0 = './data/from/companies-from-bitrix24.json';
const bx1 = getListFromJSON(bx0);
const bx2 = getDB24WithoutTrashlist(bx1);
const bx3 = getDB24WithReplacelist(bx2);
const bx4 = filterArrByFieldAndRegexp(bx3, `TITLE`, /_/); // Отбираем только те что со знаком "_"
export const DATA_FROM_BITRIX24 = sortingArr(bx4, `TITLE`); // Cортируем по TITLE
