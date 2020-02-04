const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    tag(id: ID!): Tag
    tags(sortBy: TagSort, orderBy: Order): TagFeed!
  }

  extend type Mutation {
    createTag(input: TagInput): Tag
    deleteTag(id: ID!): Response
    updateTag(id: ID!, input: TagInput): Response
  }

  input TagInput {
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
    feed: [Tag]!
  }

  enum TagSort {
    id
    name
    userId
    groupId
  }
`;

module.exports = { typeDefs };
