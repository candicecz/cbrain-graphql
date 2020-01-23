const { sortResults, snakeKey, camelKey } = require("../../utils");
const fetchCbrain = require("../../cbrain-api");
const changeCase = require("change-case");
const R = require("ramda");

const route = "tasks";

const transformTask = async (task, context) => {
  if (context.loaders === undefined) {
    return camelKey(task);
  }
  const { user_id, group_id, bourreau_id, ...rest } = await task;
  const user = await context.loaders.user.load(user_id);
  const group = await context.loaders.group.load(group_id);
  const bourreau = await context.loaders.bourreau.load(bourreau_id);

  return camelKey({
    ...task,
    user,
    group,
    bourreau
  });
};

const resolvers = {
  Query: {
    taskTableHeaders: () => {
      return [
        { header: "type", accessor: "type" },
        { header: "owner", accessor: "userId" },
        { header: "description", accessor: "description" },
        { header: "execution server", accessor: "bourreauId" },
        { header: "status", accessor: "status" },
        { header: "created", accessor: "createdAt" },
        { header: "updated", accessor: "updatedAt" }
      ];
    },
    getTasks: async (
      _,
      { cursor = 1, limit = 100, sortBy, orderBy },
      context
    ) => {
      const data = await fetchCbrain(
        context,
        `tasks?page=${cursor}&per_page=${limit}`
      )
        .then(data => data.json())
        .then(tasks => tasks.map(async task => transformTask(task, context)));

      const results = await Promise.all(data);

      return {
        hasMore: false,
        cursor: cursor + 1,
        [`${changeCase.camelCase(route)}`]:
          sortResults({ sortBy, orderBy, results }) || []
      };
    },
    getTaskById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`)
        .then(data => data.json())
        .then(async task => transformTask(task, context));
    },
    getTasksByGroupId: async (
      _,
      { id, cursor = 1, limit = 100, sortBy, orderBy },
      context
    ) => {
      const data = await fetchCbrain(
        context,
        `tasks?page=${cursor}&per_page=${limit}`
      )
        .then(data => data.json())
        .then(tasks => tasks.map(async task => transformTask(task, context)));
      const results = await Promise.all(data);

      return {
        hasMore: false,
        cursor: cursor + 1,
        [`${changeCase.camelCase(route)}`]:
          sortResults({
            sortBy,
            orderBy,
            results: R.filter(r => {
              if (r.groupId || (r.group && r.group.id)) {
                return (+r.groupId || r.group.id) === +id;
              }
            }, results)
          }) || []
      };
    }
  },
  Mutation: {
    createTask: (_, { input }, context) => {
      const { user } = context;
      const { toolId, ...rest } = input;
      return fetchCbrain(
        context,
        route,
        { method: "POST" },
        {
          tool_id: toolId,
          cbrain_task: snakeKey({
            ...rest,
            userId: user.userId
          })
        }
      )
        .then(data => data.json())
        .then(task => camelKey(task[0]));
    }
  }
};

module.exports = { resolvers };
