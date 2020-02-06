const { sort } = require("../../utils");
const R = require("ramda");

const relativeURL = "tool_configs";

const resolvers = {
  Query: {
    toolConfigs: async (
      _,
      { cursor, limit, sortBy, orderBy, toolId },
      context
    ) => {
      let data = await context.query(
        `${relativeURL}?page=${cursor}&per_page=${limit}`
      );
      if (toolId) {
        data = R.filter(R.propEq("toolId", +toolId), await data);
      }
      return { feed: sort({ data, sortBy, orderBy }) };
    },
    toolConfig: async (_, { id }, context) =>
      await context.query(`${relativeURL}/${id}`)
  }
};

module.exports = { resolvers };
