const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    getTagById(id: ID!): Tag
    getTags(cursor: Int, limit: Int, sortBy: TagSort, orderBy: Order): TagFeed!
  }

  extend type Mutation {
    createTag(input: TagInput): Tag
    deleteTag(id: ID!): Response
    updateTag(id: ID!, input: TagInput): Response
  }

  input TagInput {
    id: ID
    name: String!
    userId: ID
    groupId: ID
  }

  type Tag {
    id: ID
    name: String
    userId: ID
    groupId: ID
  }

  type TagFeed {
    cursor: Int!
    hasMore: Boolean!
    tags: [Tag]!
  }

  enum TagSort {
    id
    name
    userId
    groupId
  }
`;

module.exports = { typeDefs };
