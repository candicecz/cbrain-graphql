const { gql } = require("apollo-server");
const fetchCbrain = require("../cbrain-api");
const { paginateResults, sortResults, camelKey } = require("../utils");

const route = "bourreaux";

const typeDefs = gql`
  extend type Query {
    getBourreauById(id: ID!): Bourreau

    getBourreaux(
      cursor: String
      limit: Int
      sortBy: BourreauSort
      orderBy: Order
    ): BourreauFeed!
  }

  type Bourreau {
    id: ID
    name: String
    userId: ID
    groupId: ID
    online: Boolean
    readOnly: Boolean
    description: String
  }

  type BourreauFeed {
    cursor: String!
    hasMore: Boolean!
    bourreaux: [Bourreau]
  }

  enum BourreauSort {
    id
    name
    userId
    groupId
    description
  }
`;

const resolvers = {
  Query: {
    getBourreaux: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const results = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(bourreaux => bourreaux.map(bourreau => camelKey(bourreau)));
      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    },
    getBourreauById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`)
        .then(data => data.json())
        .then(bourreau => camelKey(bourreau));
    }
  }
};

module.exports = { typeDefs, resolvers };
