const R = require("ramda");

const sort = ({ data, sortBy, orderBy = "ASC" }) => {
  if (!sortBy) {
    return data;
  }
  const toLower = v => (R.type(v) === "String" ? R.toLower(v) : v);
  const order = v => (orderBy === "ASC" ? R.ascend : R.descend)(v);

  return R.sort(order(R.compose(toLower, R.prop(`${sortBy}`))), data);
};

module.exports = {
  sort
};
