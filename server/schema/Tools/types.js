const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    getTools(
      cursor: Int
      limit: Int
      sortBy: ToolSort
      orderBy: Order
    ): ToolFeed!
  }

  type Tool {
    id: ID
    name: String
    userId: ID
    groupId: ID
    category: String
    description: String
    cbrainTaskName: String
    menu: String
    url: String
  }

  type ToolFeed {
    cursor: Int!
    hasMore: Boolean!
    tools: [Tool]!
  }

  enum ToolSort {
    id
    name
    userIdgroupId
    category
    description
    cbrainTaskName
    url
  }
`;

module.exports = { typeDefs };
