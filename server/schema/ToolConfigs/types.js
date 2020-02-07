const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    toolConfig(id: ID!): ToolConfig
    toolConfigs(
      toolId: ID
      cursor: Int
      limit: Int
      sortBy: ToolConfigSort
      orderBy: Order
    ): ToolConfigFeed!
  }

  type ToolConfig {
    id: ID
    versionName: String
    description: String
    toolId: ID
    bourreauId: ID
    groupId: ID
    ncpus: Int
  }

  type ToolConfigFeed {
    feed: [ToolConfig]!
  }

  enum ToolConfigSort {
    id
    versionName
    description
    toolId
    bourreauId
    groupId
    ncpus
  }
`;

module.exports = { typeDefs };
