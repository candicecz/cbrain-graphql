const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../../utils");

const fetchCbrain = require("../../cbrain-api");

const route = "data_providers";

const resolvers = {
  Query: {
    getDataProviders: async (
      _,
      { cursor, limit, sortBy, orderBy },
      context
    ) => {
      const results = await fetchCbrain(context, `${route}`)
        .then(data => data.json())
        .then(dataProviders =>
          dataProviders.map(dataProvider => camelKey(dataProvider))
        );
      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    },
    getDataProviderById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/`, { method: "GET" }, { id })
        .then(data => data.json())
        .then(dataProvider => {
          return camelKey(dataProvider[0]);
        });
    },
    browseDataProvider: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}/browse`)
        .then(data => data.json())
        .then(userfiles => userfiles.map(userfile => camelKey(userfile)));
    },
    isAliveDataProvider: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}/is_alive`)
        .then(data => data.json())
        .then(({ is_alive }) => ({ isAlive: is_alive }));
    }
  },
  Mutation: {}
};

module.exports = { resolvers };
