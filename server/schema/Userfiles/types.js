const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    userfilesTableHeaders: [Heading!]!
    getUserfileById(id: ID!): Userfile
    getUserfiles(
      cursor: Int
      limit: Int
      sortBy: UserfileSort
      orderBy: Order
    ): UserfileFeed!
    getUserfileContent(id: ID!): String
    getUserfilesByGroupId(
      id: ID!
      cursor: Int
      limit: Int
      sortBy: UserfileSort
      orderBy: Order
    ): UserfileFeed!
  }

  extend type Mutation {
    singleUpload(input: UserfileInput): Response
    deleteUserfiles(ids: [ID!]!): Response
    updateUserfile(id: ID!, input: UpdateUserfileInput): Response
  }

  type Userfile {
    id: ID
    name: String
    size: String
    userId: ID
    parentId: ID
    type: String
    groupId: ID
    dataProviderId: ID
    groupWritable: String
    numFiles: Int
    hidden: String
    immutable: String
    archived: String
    description: String
    user: User
    group: Group
    dataProvider: DataProvider
  }

  type UserfileFeed {
    cursor: Int!
    hasMore: Boolean!
    userfiles: [Userfile]!
  }

  enum ExtractMode {
    collection
    multiple
  }

  input UserfileInput {
    file: Upload!
    dataProviderId: ID
    groupId: ID
    extract: Boolean
    fileType: String
    extractMode: ExtractMode
  }

  enum UserfileSort {
    id
    name
    size
    userId
    parentId
    type
    groupId
    dataProviderId
    groupWritable
    numFiles
    hidden
    immutable
    archived
    description
  }

  input UpdateUserfileInput {
    name: String
    description: String
    groupId: ID
    type: String
    archived: Boolean
    hidden: Boolean
    immutable: Boolean
    groupWritable: Boolean
    userId: ID
  }
`;

module.exports = { typeDefs };
