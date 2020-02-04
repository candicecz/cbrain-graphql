const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    tools(cursor: Int, limit: Int, sortBy: ToolSort, orderBy: Order): ToolFeed!
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
    feed: [Tool]!
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
