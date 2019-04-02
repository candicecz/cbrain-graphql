const { gql } = require("apollo-server");
const fetchCbrain = require("../cbrain-api");
const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../utils");

const route = "data_providers";

const typeDefs = gql`
  extend type Query {
    getDataProviderById(id: ID!): DataProvider
    getDataProviders(
      cursor: String
      limit: Int
      sortBy: DataProviderSort
      orderBy: Order
    ): DataProviderFeed!
    browseDataProvider(id: ID!): [UserFile]
    isAliveDataProvider(id: ID!): Alive
  }

  type UserFile {
    id: ID
    name: String
    userId: ID
    groupId: ID
    owner: String
    permissions: Int
    size: Int
    state: Boolean
    message: String
    symbolicType: String
    aTime: Int
    mTime: Int
  }

  type DataProvider {
    id: ID
    name: String
    type: String
    userId: ID
    groupId: ID
    online: Boolean
    readOnly: Boolean
    description: String
    isBrowsable: Boolean
    isFastSyncing: Boolean
    allowFileOwnerChange: Boolean
    contentStorageShared: Boolean
  }

  type DataProviderFeed {
    cursor: String!
    hasMore: Boolean!
    dataProviders: [DataProvider]!
  }

  type Alive {
    isAlive: Boolean
  }
  enum DataProviderSort {
    id
    name
    type
    userId
    groupId
    description
  }
`;

const resolvers = {
  Query: {
    getDataProviders: async (
      _,
      { cursor, limit, sortBy, orderBy },
      context
    ) => {
      const results = await fetchCbrain(context, `${route}`)
        .then(data => data.json())
        .then(dataProviders =>
          dataProviders.map(dataProvider => camelKey(dataProvider))
        );
      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    },
    getDataProviderById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/`, { method: "GET" }, { id })
        .then(data => data.json())
        .then(dataProvider => camelKey(dataProvider[0]));
    },
    browseDataProvider: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}/browse`)
        .then(data => data.json())
        .then(userfiles => userfiles.map(userfile => camelKey(userfile)));
    },
    isAliveDataProvider: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}/is_alive`)
        .then(data => data.json())
        .then(({ is_alive }) => ({ isAlive: is_alive }));
    }
  },
  Mutation: {}
};

module.exports = { typeDefs, resolvers };
