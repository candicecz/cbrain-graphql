const { gql } = require("apollo-server");
const fetch = require("../cbrain-api");
const { paginateResults } = require("../utils");

const typeDefs = gql`
  extend type Query {
    getTag(id: ID!): Tag
    getTags(pageSize: Int, after: String): TagPagination!
  }

  extend type Mutation {
    createTag(input: TagInput): Tag
    deleteTag(id: ID!): Response
    updateTag(id: ID!, input: TagInput): Tag
  }

  input TagInput {
    id: ID
    name: String
    userId: ID
    groupId: ID
  }

  type Tag {
    id: ID
    name: String
    userId: ID
    groupId: ID
  }

  type TagPagination {
    cursor: String!
    hasMore: Boolean!
    tags: [Tag]!
  }
`;

const resolvers = {
  Query: {
    getTags: async (_, { pageSize, after }, context) => {
      const allTags = await fetch(context, "tags")
        .then(data => data.json())
        .then(tags => tags.map(tag => formData(tag)))
        .catch(err => err);
      const tags = paginateResults({
        after,
        pageSize,
        results: allTags
      });
      return {
        tags,
        cursor: tags.length ? tags[tags.length - 1].cursor : null,
        hasMore: tags.length
          ? tags[tags.length - 1].cursor !== allTags[allTags.length - 1].cursor
          : false
      };
    },
    getTag: (_, { id }, context) => {
      return fetch(context, `tags/${id}`)
        .then(data => data.json())
        .then(tag => {
          return formData(tag);
        })
        .catch(err => err);
    }
  },
  Mutation: {
    createTag: (_, { input }, context) => {
      const tag = {
        ...input,
        user_id: input.userId,
        group_id: input.groupId
      };
      return fetch(context, "tags", { method: "POST" }, { tag })
        .then(data => data.json())
        .then(tag => formData(tag));
    },
    updateTag: (_, { id, input }, context) => {
      const tag = {
        ...input,
        user_id: input.userId,
        group_id: input.groupId
      };
      return fetch(context, `tags/${id}`, { method: "PUT" }, { tag })
        .then(data => data.json())
        .then(tag => formData(tag))
        .catch(err => err);
    },
    deleteTag: (_, { id }, context) => {
      return fetch(context, `tags/${id}`, { method: "DELETE" })
        .then(res => {
          return {
            status: res.status,
            success: res.status === 200
          };
        })
        .catch(err => err);
    }
  }
};

const formData = tag => {
  return {
    id: tag.id,
    name: tag.name,
    userId: tag.user_id,
    groupId: tag.group_id
  };
};

module.exports = { typeDefs, resolvers };
