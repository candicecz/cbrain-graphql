const { sort } = require("../../utils");

const relativeURL = "tools";

const resolvers = {
  Query: {
    tools: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const data = context.query(
        `${relativeURL}?page=${cursor}&per_page=${limit}`
      );
      return { feed: sort({ data, sortBy, orderBy }) };
    }
  }
};

module.exports = { resolvers };
