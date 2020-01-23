const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../../utils");
const fetchCbrain = require("../../cbrain-api");

const route = "tool_configs";

const resolvers = {
  Query: {
    getToolConfigs: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const results = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(toolconfigs =>
          toolconfigs.map(toolconfig => camelKey(toolconfig))
        );

      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    },
    getToolConfigByToolId: async (_, { id }, context) => {
      const result = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(toolconfigs =>
          toolconfigs.filter(toolconfig => {
            if (+id === +toolconfig.tool_id) {
              return toolconfig;
            }
          })
        );

      return camelKey(result[0]);
    },
    getToolConfigById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`)
        .then(data => data.json())
        .then(toolconfig => camelKey(toolconfig));
    }
  }
};

module.exports = { resolvers };
