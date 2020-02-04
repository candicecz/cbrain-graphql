const { sort } = require("../../utils");

const relativeURL = "tool_configs";

const resolvers = {
  Query: {
    toolConfigs: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const data = await context.query(
        `${relativeURL}?page=${cursor}&per_page=${limit}`
      );
      return { feed: sort({ data, sortBy, orderBy }) };
    },
    toolConfig: async (_, { id }, context) =>
      await context.query(`${relativeURL}/${id}`)
  }
};

module.exports = { resolvers };
