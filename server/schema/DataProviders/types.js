const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    dataProvider(id: ID!): DataProvider
    dataProviders(
      cursor: Int
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
    feed: [DataProvider]!
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

module.exports = { typeDefs };
