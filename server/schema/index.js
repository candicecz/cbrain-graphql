const { gql, makeExecutableSchema } = require("apollo-server");
const R = require("ramda");
const sessions = require("./sessions");
const groups = require("./groups");

const typeDefs = gql`
  type Query {
    _empty: String
    getUser(id: ID!, token: String): User
  }

  type Mutation {
    _empty: String
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

  type Response {
    status: Int
    success: Boolean!
    message: String
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, sessions.typeDefs, groups.typeDefs],
  resolvers: R.mergeDeepWith({}, sessions.resolvers, groups.resolvers)
});

module.exports = schema;
