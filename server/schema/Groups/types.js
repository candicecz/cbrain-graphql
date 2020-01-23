const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    getGroupById(id: ID!): Group
    getGroups(
      cursor: Int
      limit: Int
      sortBy: GroupSort
      orderBy: Order
    ): GroupFeed!
    groupTableHeaders: [Heading!]!
  }

  extend type Mutation {
    createGroup(input: GroupInput): Group
    deleteGroup(id: ID!): Response
    deleteGroups(ids: [ID!]!): [Response!]!
    updateGroup(id: ID!, input: GroupInput): Response
  }

  type Heading {
    header: String!
    accessor: String!
  }

  input GroupInput {
    name: String!
    description: String
    siteId: ID
    invisible: Boolean
  }

  type Group {
    id: ID
    name: String
    description: String
    type: String
    siteId: ID
    creatorId: Int
    invisible: Boolean
    files: Int
    tasks: Int
    users: Int
  }

  type GroupFeed {
    cursor: Int!
    hasMore: Boolean!
    groups: [Group]!
  }

  enum GroupSort {
    id
    name
    description
    creatorId
    siteId
    type
    invisible
    files
    users
    tasks
  }
`;

module.exports = { typeDefs };
