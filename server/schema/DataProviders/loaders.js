const DataLoader = require("dataloader");
const { resolvers } = require("./resolvers");

const getDataProviders = async (ids, context) => {
  try {
    return ids.map(async id => {
      return resolvers.Query.getDataProviderById(
        null,
        { id: id.toString() },
        context
      );
    });
  } catch (err) {
    throw err;
  }
};

const loaders = context => ({
  dataProvider: new DataLoader(ids => getDataProviders(ids, context))
});

module.exports = { loaders };
