const { gql } = require("apollo-server");
const fetch = require("../cbrain-api");
const { paginateResults } = require("../utils");

const typeDefs = gql`
  extend type Query {
    getTasks(pageSize: Int, after: String): TaskPagination!
    getTaskById(id: ID!): Task
  }

  extend type Mutation {
    createTask(input: TaskInput): Task
  }

  input TaskInput {
    id: ID
    type: String
    userId: ID
    groupId: ID
    bourreauId: ID
    toolConfigId: ID
    batchId: ID
    description: String
    status: String
    createdAt: String
    updatedAt: String
    runNumber: Int
    resultsDataProviderId: ID
    workdirArchived: String
    workdirSize: Int
    workdirArchiveUserfileId: ID
  }

  type Task {
    id: ID
    type: String
    userId: ID
    groupId: ID
    bourreauId: ID
    toolConfigId: ID
    batchId: ID
    description: String
    status: String
    createdAt: String
    updatedAt: String
    runNumber: Int
    resultsDataProviderId: ID
    workdirArchived: String
    workdirSize: Int
    workdirArchiveUserfileId: ID
  }

  type TaskPagination {
    cursor: String!
    hasMore: Boolean!
    tasks: [Task]!
  }
`;

const resolvers = {
  Query: {
    getTasks: async (_, { pageSize, after }, context) => {
      const allTasks = await fetch(context, "tasks")
        .then(data => data.json())
        .then(tasks => tasks.map(task => formData(task)))
        .catch(err => err);

      const tasks = paginateResults({
        after,
        pageSize,
        results: allTasks
      });

      return {
        tasks,
        cursor: tasks.length ? tasks[tasks.length - 1].cursor : null,
        hasMore: tasks.length
          ? tasks[tasks.length - 1].cursor !==
            allTasks[allTasks.length - 1].cursor
          : false
      };
    },
    getTaskById: (_, { id }, context) => {
      return fetch(context, `tasks/${id}`)
        .then(data => data.json())
        .then(task => formData(task));
    }
  },
  Mutation: {
    createTask: (_, { input }, context) => {
      const task = {
        id: input.id,
        type: input.type,
        user_id: input.userId,
        group_id: input.groupId,
        bourreau_id: input.bourreauId,
        tool_config_id: input.toolConfigId,
        batch_id: input.batchId,
        description: input.description,
        status: input.status,
        created_at: input.createdAt,
        updated_at: input.updatedAt,
        run_number: input.runNumber,
        results_data_provider_id: input.resultsDataProviderId,
        cluster_workdir_size: input.workdirSize,
        workdir_archived: input.workdirArchived,
        workdir_archive_userfile_id: input.workdirArchiveUserfileId
      };
      return fetch(context, "tasks", { method: "POST" }, { cbrain_task: task })
        .then(data => data.json())
        .then(task => formData(task))
        .catch(err => err);
    }
  }
};

const formData = task => {
  return {
    id: task.id,
    type: task.type,
    userId: task.user_id,
    groupId: task.group_id,
    bourreauId: task.bourreau_id,
    toolConfigId: task.tool_config_id,
    batchId: task.batch_id,
    description: task.description,
    status: task.status,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
    runNumber: task.run_number,
    resultsDataProviderId: task.results_data_provider_id,
    workdirArchived: task.workdir_archived,
    workdirSize: task.cluster_workdir_size,
    workdirArchiveUserfileId: task.workdir_archive_userfile_id
  };
};

module.exports = { typeDefs, resolvers };
// "type": String
//     "userId": ID
//     "groupId": ID
//     "bourreauId": ID
//     "toolConfigId": ID
//     "batchId": ID
//     "description": String
//     "status": String
//     "createdAt": String
//     "updatedAt": String
//     "runNumber": Int
//     "resultsDataProviderId": ID
//     "workdirSize": Int
//     "workdirArchiveUserfileId": ID
