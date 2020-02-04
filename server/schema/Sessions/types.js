const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    session: Session
  }
  extend type Mutation {
    login(login: String!, password: String!): Session
    logout: Response
  }

  type Session {
    userId: ID
  }
`;

module.exports = { typeDefs };
