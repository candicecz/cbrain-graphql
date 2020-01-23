const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    getParamsByToolId(id: ID!): Params
  }

  type Params {
    params: JSON
  }
`;

module.exports = { typeDefs };
