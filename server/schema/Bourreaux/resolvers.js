const { sort } = require("../../utils");

const relativeURL = "bourreaux";

const resolvers = {
  Query: {
    bourreaux: async (
      _,
      { cursor = 1, limit = 20, sortBy, orderBy },
      context
    ) => {
      const data = await context.query(
        `${relativeURL}?page=${cursor}&per_page=${limit}`
      );
      return { feed: sort({ data, sortBy, orderBy }) };
    },
    bourreau: async (_, { id }, context) =>
      await context.loaders.bourreau.load(id)
  }
};

module.exports = { resolvers, relativeURL };
