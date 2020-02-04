const DataLoader = require("dataloader");
const { relativeURL } = require("./resolvers");

const batchGetDataProviders = async (ids, context) => {
  return ids.map(async id => {
    return await context.query(`${relativeURL}/${id}`);
  });
};

const loaders = context => ({
  dataProvider: new DataLoader(ids => batchGetDataProviders(ids, context))
});

module.exports = { loaders };
