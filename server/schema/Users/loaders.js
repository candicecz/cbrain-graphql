const DataLoader = require("dataloader");
const { resolvers } = require("./resolvers");

const getUsers = async (ids, context) => {
  try {
    return ids.map(id => {
      return resolvers.Query.getUserById(null, { id: id.toString() }, context);
    });
  } catch (err) {
    throw err;
  }
};

const loaders = context => ({
  user: new DataLoader(ids => getUsers(ids, context))
});

module.exports = { loaders };
