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