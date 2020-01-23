const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../../utils");
const fetchCbrain = require("../../cbrain-api");

const route = "tools";

const resolvers = {
  Query: {
    getTools: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const results = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(tools => tools.map(tool => camelKey(tool)));
      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    }
  }
};

module.exports = { resolvers };
