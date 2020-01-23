const DataLoader = require("dataloader");
const { resolvers } = require("./resolvers");

const getUserfilesByGroupIds = async (ids, context) => {
  try {
    return ids.map(id => {
      return resolvers.Query.getUserfilesByGroupId(
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
  userfilesByGroupIds: new DataLoader(ids =>
    getUserfilesByGroupIds(ids, context)
  )
});

module.exports = { loaders };
