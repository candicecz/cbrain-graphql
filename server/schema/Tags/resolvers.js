const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../../utils");
const fetchCbrain = require("../../cbrain-api");

const route = "tags";

const resolvers = {
  Query: {
    getTags: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const results = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(tags => tags.map(tag => camelKey(tag)));
      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    },
    getTagById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`)
        .then(data => data.json())
        .then(tag => camelKey(tag));
    }
  },
  Mutation: {
    createTag: (_, { input }, context) => {
      const { user } = context;
      return fetchCbrain(
        context,
        `${route}`,
        { method: "POST" },
        { tag: snakeKey({ ...input, user: user.userId }) }
      )
        .then(data => data.json())
        .then(tag => camelKey(tag));
    },
    updateTag: (_, { id, input }, context) => {
      const { user } = context;

      return fetchCbrain(
        context,
        `${route}/${id}`,
        { method: "PUT" },
        { tag: snakeKey({ ...input, user: user.userId }) }
      ).then(res => ({ status: res.status, success: res.status === 200 }));
    },
    deleteTag: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`, { method: "DELETE" }).then(
        res => ({
          status: res.status,
          success: res.status === 200
        })
      );
    }
  }
};

module.exports = { resolvers };
