const R = require("ramda");

const sort = ({ data, sortBy, orderBy = "ASC" }) => {
  if (!sortBy) {
    return data;
  }
  const toLower = v => (R.type(v) === "String" ? R.toLower(v) : v);
  const order = v => (orderBy === "ASC" ? R.ascend : R.descend)(v);

  return R.sort(order(R.compose(toLower, R.prop(`${sortBy}`))), data);
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
  sort,
  formatBytes
};
