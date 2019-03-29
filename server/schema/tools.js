const { gql } = require("apollo-server");
const fetch = require("../cbrain-api");
const { paginateResults } = require("../utils");

const typeDefs = gql`
  extend type Query {
    getTools(pageSize: Int, after: String): ToolPagination!
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

  type ToolPagination {
    cursor: String!
    hasMore: Boolean!
    tools: [Tool]!
  }
`;

const resolvers = {
  Query: {
    getTools: async (_, { pageSize, after }, context) => {
      const allTools = await fetch(context, "tools")
        .then(data => data.json())
        .then(tools => tools.map(tool => formData(tool)))
        .catch(err => err);
      const tools = paginateResults({
        after,
        pageSize,
        results: allTools
      });
      return {
        tools,
        cursor: tools.length ? tools[tools.length - 1].cursor : null,
        hasMore: tools.length
          ? tools[tools.length - 1].cursor !==
            allTools[allTools.length - 1].cursor
          : false
      };
    }
  }
};

const formData = tool => {
  return {
    id: tool.id,
    name: tool.name,
    userId: tool.user_id,
    groupId: tool.group_id,
    category: tool.category,
    description: tool.description,
    cbrainTaskName: tool.cbrain_task_class_name,
    menu: tool.select_menu_text,
    url: tool.url
  };
};

module.exports = { typeDefs, resolvers };
