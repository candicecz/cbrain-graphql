const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    group(id: ID!): Group
    groups(
      cursor: Int
      limit: Int
      sortBy: GroupSort
      orderBy: Order
    ): GroupFeed!
    groupTableHeaders: [Heading!]!
  }

  extend type Mutation {
    createGroup(input: GroupInput): Group
    updateGroup(id: ID!, input: GroupInput): Response
    deleteGroups(ids: [ID!]!): [Response!]!
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
    userfiles: [Userfile!]!
    tasks: [Task!]!
    users: [User!]!
  }

  type GroupFeed {
    feed: [Group!]!
  }

  enum GroupSort {
    id
    name
    description
    creatorId
    siteId
    type
    invisible
    userfiles
    users
    tasks
  }
`;

module.exports = { typeDefs };
