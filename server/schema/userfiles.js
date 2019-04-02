const { gql } = require("apollo-server");
const fetchCbrain = require("../cbrain-api");
const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../utils");

const route = "userfiles";

const typeDefs = gql`
  extend type Query {
    getUserfileById(id: ID!): Userfile
    getUserfiles(
      cursor: String
      limit: Int
      sortBy: UserfileSort
      orderBy: Order
    ): UserfileFeed!
    getUserfileContent(id: ID!): String
  }

  extend type Mutation {
    uploadUserfile(input: UserfileInput): Userfile
  }

  type Userfile {
    id: ID
    name: String
    size: Int
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
  }

  type UserfileFeed {
    cursor: String!
    hasMore: Boolean!
    userfiles: [Userfile]!
  }

  input UserfileInput {
    uploadFile: Upload
    dataProviderId: ID
    userfile: GroupId
    fileType: String
    _doExtract: String
    _upExMode: String
  }

  input GroupId {
    groupId: ID!
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
`;

const resolvers = {
  Query: {
    getUserfiles: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const results = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(userfiles => userfiles.map(userfile => camelKey(userfile)));
      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    },
    getUserfileById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`)
        .then(data => data.json())
        .then(userfile => camelKey(userfile));
    },
    getUserfileContent: (_, { id }, context) => {
      // Note: Might need adjustments to work
      return fetchCbrain(context, `${route}/${id}/content`).then(data => data);
    }
  },
  Mutation: {
    uploadUserfile: async (_, { input }, context) => {
      return;
    }
  }
};

module.exports = { typeDefs, resolvers };
