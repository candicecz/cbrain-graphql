const humps = require("humps");
const qs = require("qs");
const { sort } = require("../../utils");

const relativeURL = "tasks";

const resolvers = {
  Query: {
    tasks: async (
      _,
      { cursor = 1, limit = 1000, sortBy, orderBy, groupId },
      context
    ) => {
      let tasks;
      if (groupId) {
        tasks = await context.loaders.tasksByGroupId.load(+groupId);
      } else {
        tasks = await context.query(
          `${relativeURL}?page=${cursor}&per_page=${limit}`
        );
      }

      const data = await context.loaders.nestedTask.loadMany(tasks);

      return { feed: sort({ data, sortBy, orderBy }) };
    },
    task: async (_, { id }, context) => {
      const task = await context.query(`${relativeURL}/${id}`);
      return await context.loaders.nestedTask.load(task);
    },
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
    }
  },
  Mutation: {
    createTask: async (_, { input }, context) => {
      const { toolId, ...rest } = input;
      const query_string = qs.stringify(
        {
          tool_id: toolId,
          cbrain_task: humps.decamelizeKeys({
            ...rest,
            userId: context.user.userId
          })
        },
        { encode: false }
      );

      const tasks = await context.query(`${relativeURL}?${query_string}`, {
        method: "POST"
      });
      return tasks[0];
    }
  }
};

module.exports = { resolvers, relativeURL };
