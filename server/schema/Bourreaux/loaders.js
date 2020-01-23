const DataLoader = require("dataloader");
const { resolvers } = require("./resolvers");

const getBourreaux = async (ids, context) => {
  try {
    return ids.map(id => {
      return resolvers.Query.getBourreauById(
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
  bourreau: new DataLoader(ids => getBourreaux(ids, context))
});

module.exports = { loaders };
