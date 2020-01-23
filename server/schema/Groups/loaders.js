const DataLoader = require("dataloader");
const { resolvers } = require("./resolvers");

const deleteGroups = async (ids, context) => {
  try {
    const data = ids.map(
      async id =>
        await resolvers.Mutation.deleteGroup(
          null,
          { id: id.toString() },
          context
        )
    );
    const results = await Promise.all(data);
    return results;
  } catch (err) {
    throw err;
  }
};

const getGroups = async (ids, context) => {
  try {
    return ids.map(async id => {
      return resolvers.Query.getGroupById(null, { id: id.toString() }, context);
    });
  } catch (err) {
    throw err;
  }
};

const loaders = context => ({
  deleteGroup: new DataLoader(ids => deleteGroups(ids, context)),
  group: new DataLoader(ids => getGroups(ids, context))
});

module.exports = { loaders };
