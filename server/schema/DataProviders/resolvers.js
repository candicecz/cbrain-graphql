const { sort } = require("../../utils");

const relativeURL = "data_providers";

const resolvers = {
  Query: {
    dataProviders: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const data = await context.query(
        `${relativeURL}?page=${cursor}&per_page=${limit}`
      );
      return { feed: sort({ data, sortBy, orderBy }) };
    },
    dataProvider: async (_, { id }, context) => {
      return await context.loaders.dataProvider.load(id);
    },
    browseDataProvider: async (_, { id }, context) => {
      return await context.query(`${relativeURL}/${id}/browse`);
    },
    isAliveDataProvider: async (_, { id }, context) => {
      return await context.query(`${relativeURL}/${id}/is_alive`);
    }
  },
  Mutation: {}
};

module.exports = { resolvers, relativeURL };
