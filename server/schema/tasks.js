const { gql } = require("apollo-server");
const fetchCbrain = require("../cbrain-api");
const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../utils");

const route = "tasks";
const typeDefs = gql`
  extend type Query {
    getTasks(
      cursor: String
      limit: Int
      sortBy: GroupSort
      orderBy: Order
    ): TaskFeed!
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
    params: JSON
    status: String
    createdAt: String
    updatedAt: String
    runNumber: Int
    resultsDataProviderId: ID
    clusterWordirSize: Int
    workdirArchived: String
    workdirArchiveUserfileId: ID
    description: String
  }

  type Task {
    id: ID
    type: String
    userId: ID
    groupId: ID
    bourreauId: ID
    toolConfigId: ID
    batchId: ID
    params: JSON
    status: String
    createdAt: String
    updatedAt: String
    runNumber: Int
    resultsDataProviderId: ID
    clusterWordirSize: Int
    workdirArchived: String
    workdirArchiveUserfileId: ID
    description: String
  }

  type TaskFeed {
    cursor: String!
    hasMore: Boolean!
    tasks: [Task]!
  }
`;

const resolvers = {
  Query: {
    getTasks: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const results = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(tasks => tasks.map(task => camelKey(task)));

      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    },
    getTaskById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`)
        .then(data => data.json())
        .then(task => camelKey(task));
    }
  },
  Mutation: {
    createTask: (_, { input }, context) => {
      const { user } = context;
      return fetchCbrain(
        context,
        route,
        { method: "POST" },
        { cbrain_task: snakeKey({ ...input, userId: user.userId }) }
      )
        .then(data => data.json())
        .then(task => camelKey(task[0]));
    }
  }
};

module.exports = { typeDefs, resolvers };
