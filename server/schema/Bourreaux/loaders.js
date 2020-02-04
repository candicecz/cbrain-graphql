const { relativeURL } = require("./resolvers");
const DataLoader = require("dataloader");

const batchGetBourreaux = async (ids, context) => {
  return ids.map(async id => await context.query(`${relativeURL}/${id}`));
};

const loaders = context => ({
  bourreau: new DataLoader(ids => batchGetBourreaux(ids, context))
});

module.exports = { loaders };
