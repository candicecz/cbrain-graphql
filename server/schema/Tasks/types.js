const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    task(id: ID!): Task
    tasks(
      groupId: ID
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
    feed: [Task!]
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

module.exports = { typeDefs };
