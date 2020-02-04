const { sort } = require("../../utils");
const humps = require("humps");
const qs = require("qs");

const relativeURL = "tags";

const resolvers = {
  Query: {
    tags: async (_, { sortBy, orderBy }, context) => {
      const data = await context.query(`${relativeURL}`);
      return { feed: sort({ data, sortBy, orderBy }) };
    },
    tag: async (_, { id }, context) =>
      await context.query(`${relativeURL}/${id}`)
  },
  Mutation: {
    createTag: async (_, { input }, context) => {
      const query_string = qs.stringify({
        tag: humps.decamelizeKeys({
          ...input,
          user: context.user.userId
        })
      });
      return await context.query(`${relativeURL}?${query_string}`, {
        method: "POST"
      });
    },
    updateTag: async (_, { id, input }, context) => {
      const query_string = qs.stringify({
        tag: humps.decamelizeKeys({ ...input, user: context.user.userId })
      });

      return await context.query(`${relativeURL}/${id}?${query_string}`, {
        method: "PUT"
      });
    },
    deleteTag: async (_, { id }, context) =>
      await context.query(`${relativeURL}/${id}`, { method: "DELETE" })
  }
};

module.exports = { resolvers };
