const R = require("ramda");
const changeCase = require("change-case");

const paginateResults = ({ cursor, limit = 100, results, route }) => {
  if (!results.length || limit < 1)
    return { [`${route}`]: results, cursor: 0, hasMore: false };
  if (!cursor) {
    cursor = results[0].id;
  }
  cursor = parseInt(cursor);
  const cursorIndex = R.findIndex(R.propEq("id", cursor))(results);
  const newCursor =
    cursorIndex + limit < results.length
      ? results[cursorIndex + limit].id
      : results[cursorIndex].id;
  return {
    [`${changeCase.camelCase(route)}`]:
      results.slice(
        cursorIndex,
        Math.min(results.length, cursorIndex + limit)
      ) || [],
    cursor: newCursor,
    hasMore: cursorIndex + limit <= results.length ? true : false
  };
};

const sortResults = ({ sortBy, orderBy = "ASC", results }) => {
  if (!sortBy) return results;
  const formatted = f => (R.type(f) === "String" ? R.toLower(f) : f);
  const ordered = values => (orderBy === "ASC" ? R.ascend : R.descend)(values);
  return R.sort(ordered(R.compose(formatted, R.prop(`${sortBy}`))), results);
};

/* 
  Object Formatting [camelKey + snakeKey]: 
  Request keys must be snaked for the api calls
  and camelcased for the schema types.
*/

const snakeKey = obj => {
  return R.fromPairs(
    Object.entries(obj).map(([k, v]) => [changeCase.snakeCase(k), v])
  );
};

const camelKey = obj => {
  return R.fromPairs(
    Object.entries(obj).map(([k, v]) => [changeCase.camelCase(k), v])
  );
};

/* Formats Bytes to MB, KB, etc */
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

module.exports = {
  snakeKey,
  camelKey,
  sortResults,
  paginateResults,
  formatBytes
};
