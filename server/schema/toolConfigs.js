const { gql } = require("apollo-server");
const fetchCbrain = require("../cbrain-api");
const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../utils");

const route = "tool_configs";

const typeDefs = gql`
  extend type Query {
    getToolConfigById(id: ID!): ToolConfig
    getToolConfigs(
      cursor: String
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
    cursor: String!
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

const resolvers = {
  Query: {
    getToolConfigs: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const results = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(toolconfigs =>
          toolconfigs.map(toolconfig => camelKey(toolconfig))
        );

      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    },
    getToolConfigById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`)
        .then(data => data.json())
        .then(toolconfig => camelKey(toolconfig));
    }
  }
};

module.exports = { typeDefs, resolvers };
