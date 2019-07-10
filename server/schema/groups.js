const { gql } = require("apollo-server");
const fetchCbrain = require("../cbrain-api");
const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../utils");

const route = "groups";

const typeDefs = gql`
  extend type Query {
    getGroupById(id: ID!): Group
    getGroups(
      cursor: Int
      limit: Int
      sortBy: GroupSort
      orderBy: Order
    ): GroupFeed!
  }

  extend type Mutation {
    createGroup(input: GroupInput): Group
    deleteGroup(id: ID!): Response
    updateGroup(id: ID!, input: GroupInput): Response
  }

  input GroupInput {
    name: String!
    description: String
    type: String
    siteId: ID
    creatorId: Int
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
  }
`;

const resolvers = {
  Query: {
    getGroups: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const results = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(groups => groups.map(group => camelKey(group)));
      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    },
    getGroupById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`)
        .then(data => data.json())
        .then(group => camelKey(group));
    }
  },

  Mutation: {
    createGroup: (_, { input }, context) => {
      const { user } = context;
      return fetchCbrain(
        context,
        route,
        { method: "POST" },
        { group: snakeKey({ ...input, creatorId: user.userId }) }
      )
        .then(data => data.json())
        .then(group => camelKey(group));
    },
    updateGroup: (_, { id, input }, context) => {
      const { user } = context;

      return fetchCbrain(
        context,
        `${route}/${id}`,
        { method: "PUT" },
        { group: snakeKey({ ...input, creatorId: user.userId }) }
      ).then(res => {
        return {
          status: res.status,
          success: res.status === 200
        };
      });
    },
    deleteGroup: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`, { method: "DELETE" }).then(
        res => {
          return {
            status: res.status,
            success: res.status === 200
          };
        }
      );
    }
  }
};

module.exports = { typeDefs, resolvers };
