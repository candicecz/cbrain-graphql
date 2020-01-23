const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    getToolConfigById(id: ID!): ToolConfig
    getToolConfigByToolId(id: ID!): ToolConfig
    getToolConfigs(
      cursor: Int
      limit: Int
      sortBy: ToolConfigSort
      orderBy: Order
    ): ToolConfigFeed!
  }

  type ToolConfig {
    id: ID
    version: String
    description: String
    toolId: ID
    bourreauId: ID
    groupId: ID
    ncpus: Int
  }

  type ToolConfigFeed {
    cursor: Int!
    hasMore: Boolean!
    toolConfigs: [ToolConfig]!
  }

  enum ToolConfigSort {
    id
    version
    description
    toolId
    bourreauId
    groupId
    ncpus
  }
`;

module.exports = { typeDefs };
