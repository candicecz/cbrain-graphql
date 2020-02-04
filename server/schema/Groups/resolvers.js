const humps = require("humps");
const qs = require("qs");
const { sort } = require("../../utils");

const relativeURL = "groups";

const resolvers = {
  Query: {
    groups: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const groups = await context.query(
        `${relativeURL}?page=${cursor}&per_page=${limit}`
      );
      const data = await context.loaders.nestedGroup.loadMany(groups);

      return {
        feed: sort({ data, sortBy, orderBy })
      };
    },
    group: async (_, { id }, context) => {
      const group = await context.loaders.group.load(id);
      return await context.loaders.nestedGroup.load(group);
    },
    groupTableHeaders: () => {
      return [
        { header: "name", accessor: "name" },
        { header: "type", accessor: "type" },
        { header: "site", accessor: "siteId" },
        { header: "creator", accessor: "creatorId" },
        { header: "users", accessor: "users" },
        { header: "files", accessor: "files" },
        { header: "tasks", accessor: "tasks" }
      ];
    }
  },

  Mutation: {
    createGroup: async (_, { input }, context) => {
      const query_string = qs.stringify(
        {
          group: humps.decamelizeKeys({
            ...input,
            creatorId: context.user.userId
          })
        },
        { encode: false }
      );

      const group = await context.query(`${relativeURL}?${query_string}`, {
        method: "POST"
      });
      return {
        ...group,
        files: [],
        tasks: [],
        users: []
      };
    },

    updateGroup: async (_, { id, input }, context) => {
      const query_string = qs.stringify(
        {
          group: humps.decamelizeKeys({
            ...input,
            creatorId: context.user.userId
          })
        },
        { encode: false }
      );

      return await context.query(`${relativeURL}/${id}?${query_string}`, {
        method: "PUT"
      });
    },

    deleteGroups: async (_, { ids }, context) =>
      await context.loaders.deleteGroup.loadMany(ids)
  }
};

module.exports = { resolvers, relativeURL };
