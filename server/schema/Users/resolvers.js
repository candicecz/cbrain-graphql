const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../../utils");

const fetchCbrain = require("../../cbrain-api");
const route = "users";

const resolvers = {
  Query: {
    getUsers: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const results = await fetchCbrain(context, "users")
        .then(data => data.json())
        .then(users => users.map(user => camelKey(user)));
      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    },
    getUserById: async (_, { id }, context) => {
      const results = await fetchCbrain(context, `${route}/${id}`)
        .then(data => data.json())
        .then(user => camelKey(user));
      return results;
    }
  },
  Mutation: {
    createUser: (_, { input }, context) => {
      const { user, ...rest } = snakeKey(input);
      return fetchCbrain(
        context,
        route,
        { method: "POST" },
        {
          user: snakeKey(user),
          ...rest
        }
      ).then(res => {
        return {
          status: res.status,
          success: res.status === 200
        };
      });
    },
    updateUser: (_, { id, input }, context) => {
      const { user, ...rest } = snakeKey(input);

      return fetchCbrain(
        context,
        `${route}/${id}`,
        { method: "PUT" },
        {
          user: snakeKey(user),
          ...rest
        }
      )
        .then(data => data.json())
        .then(user => camelKey(user));
    },
    deleteUser: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`, { method: "DELETE" }).then(
        res => {
          return {
            status: res.status,
            success: res.status === 200
          };
        }
      );
    }
  }
};

module.exports = { resolvers };
