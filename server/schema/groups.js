const { gql } = require("apollo-server");
const fetch = require("../cbrain-api");
const { paginateResults } = require("../utils");

const typeDefs = gql`
  extend type Query {
    getGroups(pageSize: Int, after: String): GroupPagination!
    getGroup(id: ID!): Group
  }
  extend type Mutation {
    createGroup(input: GroupInput): Group
    deleteGroup(id: ID!): Response
    updateGroup(id: ID!, input: GroupInput): Group
  }

  input GroupInput {
    id: ID
    name: String
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

  type GroupPagination {
    cursor: String!
    hasMore: Boolean!
    groups: [Group]!
  }
`;

const resolvers = {
  Query: {
    getGroups: async (_, { pageSize, after }, context) => {
      const allGroups = await fetch(context, "groups")
        .then(data => data.json())
        .then(groups => groups.map(group => formData(group)))
        .catch(err => err);
      const groups = paginateResults({
        after,
        pageSize,
        results: allGroups
      });
      console.log({
        groups,
        cursor: groups.length ? groups[groups.length - 1].cursor : null,
        hasMore: groups.length
          ? groups[groups.length - 1].cursor !==
            allGroups[allGroups.length - 1].cursor
          : false
      });
      return {
        groups,
        cursor: groups.length ? groups[groups.length - 1].cursor : null,
        hasMore: groups.length
          ? groups[groups.length - 1].cursor !==
            allGroups[allGroups.length - 1].cursor
          : false
      };
    },
    getGroup: (_, { id }, context) => {
      return fetch(context, `groups/${id}`)
        .then(data => data.json())
        .then(group => group);
    }
  },
  Mutation: {
    createGroup: (_, { input }, context) => {
      const { siteId: site_id, creatorId: creator_id } = input;
      return fetch(
        context,
        "groups",
        { method: "POST" },
        { group: { ...input, site_id, creator_id } }
      )
        .then(data => data.json())
        .then(group => formData(group))
        .catch(err => err);
    },
    updateGroup: (_, { id, input }, context) => {
      const { siteId: site_id, creatorId: creator_id } = input;
      return fetch(
        context,
        `groups/${id}`,
        { method: "PUT" },
        { group: { ...input, site_id, creator_id } }
      )
        .then(data => data.json())
        .then(group => formData(group))
        .catch(err => err);
    },
    deleteGroup: (_, { id }, context) => {
      return fetch(context, `groups/${id}`, { method: "DELETE" })
        .then(res => {
          return {
            status: res.status,
            success: res.status === 200,
            message: `${
              res.status === 200
                ? res.status + ": Project Successfully Deleted"
                : res.status + ": Deletion Failed"
            }`
          };
        })
        .catch(err => err);
    }
  }
};

const formData = group => {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    type: group.type,
    siteId: group.site_id,
    creatorId: group.creator_id,
    invisible: group.invisible
  };
};

module.exports = { typeDefs, resolvers };
