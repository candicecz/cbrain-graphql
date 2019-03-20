const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    getSession: Session
    getUser(id: ID!, token: String): User
  }
  type User {
    id: ID!
    login: String
    password: String
    passwordConfirmation: String
    fullName: String
    email: String
    city: String
    country: String
    timeZone: String
    type: String
    siteId: Int
    lastConnectedAt: String
    accountLocked: Boolean
  }
  type Mutation {
    login(login: String!, password: String!): Session
    logout: Response
  }
  type Session {
    userId: ID
    token: String
    message: String
  }
  type Response {
    success: Boolean!
    message: String
  }
`;

module.exports = typeDefs;
