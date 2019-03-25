const { gql } = require("apollo-server");
const fetch = require("../cbrain-api");
const { paginateResults } = require("../utils");

const typeDefs = gql`
  extend type Query {
    getToolConfig(id: ID!): ToolConfig
    getToolConfigs(pageSize: Int, after: String): ToolConfigPagination!
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

  type ToolConfigPagination {
    cursor: String!
    hasMore: Boolean!
    toolconfigs: [ToolConfig]!
  }
`;

const resolvers = {
  Query: {
    getToolConfigs: async (_, { pageSize, after }, context) => {
      const allToolConfigs = await fetch(context, "tool_configs")
        .then(data => data.json())
        .then(toolconfigs =>
          toolconfigs.map(toolconfig => formData(toolconfig))
        )
        .catch(err => err);
      const toolconfigs = paginateResults({
        after,
        pageSize,
        results: allToolConfigs
      });
      return {
        toolconfigs,
        cursor: toolconfigs.length
          ? toolconfigs[toolconfigs.length - 1].cursor
          : null,
        hasMore: toolconfigs.length
          ? toolconfigs[toolconfigs.length - 1].cursor !==
            allToolConfigs[allToolConfigs.length - 1].cursor
          : false
      };
    },
    getToolConfig: (_, { id }, context) => {
      return fetch(context, `tool_configs/${id}`)
        .then(data => data.json())
        .then(toolconfig => formData(toolconfig));
    }
  }
};

const formData = toolConfig => {
  return {
    id: toolConfig.id,
    version: toolConfig.version_name,
    description: toolConfig.description,
    toolId: toolConfig.tool_id,
    bourreauId: toolConfig.bourreau_id,
    groupId: toolConfig.group_id,
    ncpus: toolConfig.ncpus
  };
};

module.exports = { typeDefs, resolvers };
