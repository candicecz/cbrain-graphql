const { sort } = require("../../utils");
const humps = require("humps");
const qs = require("qs");

const relativeURL = "users";

const resolvers = {
  Query: {
    users: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const data = await context.query(
        `${relativeURL}?page=${cursor}&per_page=${limit}`
      );
      return {
        feed: sort({ data, sortBy, orderBy })
      };
    },
    user: async (_, { id }, context) => await context.loaders.user.load(id)
  },
  Mutation: {
    createUser: async (_, { input }, context) => {
      const query_string = qs.stringify({ ...humps.decamelizeKeys(input) });

      return await context.query(`${relativeURL}?${query_string}`, {
        method: "POST"
      });
    },
    updateUser: async (_, { id, input }, context) => {
      const query_string = qs.stringify({ ...humps.decamelizeKeys(input) });

      return await context.query(`${relativeURL}/${id}?${query_string}`, {
        method: "PUT"
      });
    },
    deleteUser: async (_, { id }, context) =>
      await context.query(`${relativeURL}/${id}`, { method: "DELETE" })
  }
};

module.exports = { resolvers, relativeURL };
