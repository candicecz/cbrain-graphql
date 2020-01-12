const { gql } = require("apollo-server");
const fetchCbrain = require("../cbrain-api");
const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../utils");
const R = require("ramda");

const route = "tasks";
const typeDefs = gql`
  extend type Query {
    getTasks(
      cursor: Int
      limit: Int
      sortBy: TaskSort
      orderBy: Order
    ): TaskFeed!
    getTaskById(id: ID!): Task
    getTasksByGroupId(
      id: ID!
      cursor: Int
      limit: Int
      sortBy: TaskSort
      orderBy: Order
    ): TaskFeed!
    taskTableHeaders: [Heading!]!
  }

  extend type Mutation {
    createTask(input: TaskInput): Task
  }

  input TaskInput {
    id: ID
    type: String
    toolId: ID!
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
    user: User
    group: Group
    bourreau: Bourreau
  }

  type TaskFeed {
    cursor: Int!
    hasMore: Boolean!
    tasks: [Task]!
  }

  enum TaskSort {
    id
    type
    userId
    description
    bourreauId
    status
    createdAt
    updatedAt
  }
`;

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
    getTasks: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const data = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(tasks => tasks.map(async task => transformTask(task, context)));

      const results = await Promise.all(data);

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
        .then(async task => transformTask(task, context));
    },
    getTasksByGroupId: async (
      _,
      { id, cursor, limit, sortBy, orderBy },
      context
    ) => {
      const data = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(tasks => tasks.map(async task => transformTask(task, context)));
      const results = await Promise.all(data);

      return paginateResults({
        cursor,
        limit,
        results: sortResults({
          sortBy,
          orderBy,
          results: R.filter(r => {
            return (
              (r.groupId && +r.groupId) === +id ||
              (r.group && +r.group.id) === +id
            );
          }, results)
        }),
        route
      });
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

module.exports = { typeDefs, resolvers };
