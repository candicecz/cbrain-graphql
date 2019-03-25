const { gql } = require("apollo-server");
const fetch = require("../cbrain-api");
const { paginateResults } = require("../utils");

const typeDefs = gql`
  extend type Query {
    getBourreau(id: ID!): Bourreau
    getBourreaux(pageSize: Int, after: String): BourreauPagination!
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

  type BourreauPagination {
    cursor: String!
    hasMore: Boolean!
    bourreaux: [Bourreau]!
  }
`;

const resolvers = {
  Query: {
    getBourreaux: async (_, { pageSize, after }, context) => {
      const allBourreaux = await fetch(context, "bourreaux")
        .then(data => data.json())
        .then(bourreaux => bourreaux.map(bourreau => formData(bourreau)))
        .catch(err => err);
      const bourreaux = paginateResults({
        after,
        pageSize,
        results: allBourreaux
      });
      return {
        bourreaux,
        cursor: bourreaux.length
          ? bourreaux[bourreaux.length - 1].cursor
          : null,
        hasMore: bourreaux.length
          ? bourreaux[bourreaux.length - 1].cursor !==
            allBourreaux[allBourreaux.length - 1].cursor
          : false
      };
    },
    getBourreau: (_, { id }, context) => {
      return fetch(context, `bourreaux/${id}`)
        .then(data => data.json())
        .then(bourreau => formData(bourreau));
    }
  }
};

const formData = bourreau => {
  return {
    id: bourreau.id,
    name: bourreau.name,
    userId: bourreau.user_id,
    groupId: bourreau.group_id,
    online: bourreau.online,
    readOnly: bourreau.read_only,
    description: bourreau.description
  };
};

module.exports = { typeDefs, resolvers };
