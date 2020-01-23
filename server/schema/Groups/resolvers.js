const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../../utils");

const fetchCbrain = require("../../cbrain-api");
const route = "groups";

const transformGroup = async (group, context) => {
  if (context.loaders === undefined) {
    return camelKey(group);
  }
  const u = await context.loaders.userfilesByGroupIds.load(group.id);
  const t = await context.loaders.tasksByGroupIds.load(group.id);
  return {
    ...camelKey(group),
    files: u.userfiles.length,
    tasks: t.tasks.length,
    users: 0
  };
};

const resolvers = {
  Query: {
    getGroups: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const data = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(groups => groups.map(group => transformGroup(group, context)));
      const results = await Promise.all(data);

      return paginateResults({
        cursor,
        limit,
        results: sortResults({
          sortBy,
          orderBy,
          results
        }),
        route
      });
    },
    getGroupById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`)
        .then(data => data.json())
        .then(group => transformGroup(group, context));
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
    createGroup: (_, { input }, context) => {
      const { user } = context;
      return fetchCbrain(
        context,
        route,
        { method: "POST" },
        { group: snakeKey({ ...input, creatorId: user.userId }) }
      )
        .then(data => data.json())
        .then(group => camelKey(group));
    },
    updateGroup: (_, { id, input }, context) => {
      const { user } = context;

      return fetchCbrain(
        context,
        `${route}/${id}`,
        { method: "PUT" },
        { group: snakeKey({ ...input, creatorId: user.userId }) }
      ).then(res => {
        return {
          status: res.status,
          success: res.status === 200
        };
      });
    },
    deleteGroups: async (_, { ids }, context) => {
      const data = ids.map(id => {
        return context.loaders.deleteGroup.load(id);
      });
      const results = await Promise.all(data);
      return results;
    }
  }
};

module.exports = { resolvers };
