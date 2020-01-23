const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../../utils");
const fetchCbrain = require("../../cbrain-api");

const route = "bourreaux";

const resolvers = {
  Query: {
    getBourreaux: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const results = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(bourreaux => bourreaux.map(bourreau => camelKey(bourreau)));
      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    },
    getBourreauById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`)
        .then(data => data.json())
        .then(bourreau => camelKey(bourreau));
    }
  }
};

module.exports = { resolvers };
