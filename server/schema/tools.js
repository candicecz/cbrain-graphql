const { gql } = require("apollo-server");
const fetchCbrain = require("../cbrain-api");
const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../utils");

const route = "tools";

const typeDefs = gql`
  extend type Query {
    getTools(
      cursor: String
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
    cursor: String!
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

const resolvers = {
  Query: {
    getTools: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const results = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(tools => tools.map(tool => camelKey(tool)));
      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    }
  }
};

module.exports = { typeDefs, resolvers };
