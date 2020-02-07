const DataLoader = require("dataloader");
const { relativeURL } = require("./resolvers");

const batchGetUsers = async (ids, context) => {
  try {
    return ids.map(async id => {
      return await context.query(`${relativeURL}/${+id}`);
    });
  } catch (err) {
    throw err;
  }
};

const loaders = context => ({
  user: new DataLoader(ids => batchGetUsers(ids, context))
});

module.exports = { loaders };
