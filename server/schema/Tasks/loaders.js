const DataLoader = require("dataloader");
const { resolvers } = require("./resolvers");

const getTasksByGroupIds = async (ids, context) => {
  try {
    return ids.map(id => {
      return resolvers.Query.getTasksByGroupId(
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
  tasksByGroupIds: new DataLoader(ids => getTasksByGroupIds(ids, context))
});

module.exports = { loaders };
