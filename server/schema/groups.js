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
      cursor: String
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
    id: ID
    name: String!
    description: String
    type: String
    siteId: Int
    creatorId: Int
    invisible: Boolean
  }

  type Group {
    id: ID
    name: String
    description: String
    type: String
    siteId: Int
    creatorId: Int
    invisible: Boolean
  }

  type GroupFeed {
    cursor: String!
    hasMore: Boolean!
    groups: [Group]!
  }

  enum GroupSort {
    id
    name
    description
    creator
    siteId
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
      return fetchCbrain(
        context,
        route,
        { method: "POST" },
        { group: snakeKey(input) }
      )
        .then(data => data.json())
        .then(group => camelKey(group));
    },
    updateGroup: (_, { id, input }, context) => {
      return fetchCbrain(
        context,
        `${route}/${id}`,
        { method: "PUT" },
        { group: snakeKey(input) }
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
