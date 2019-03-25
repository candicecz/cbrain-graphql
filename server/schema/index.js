const { gql, makeExecutableSchema } = require("apollo-server");
const R = require("ramda");
const sessions = require("./sessions");
const groups = require("./groups");
const users = require("./users");
const toolConfigs = require("./toolConfigs");

const typeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Response {
    status: Int
    success: Boolean!
    message: String
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [
    typeDefs,
    sessions.typeDefs,
    groups.typeDefs,
    users.typeDefs,
    toolConfigs.typeDefs
  ],
  resolvers: [
    sessions.resolvers,
    groups.resolvers,
    users.resolvers,
    toolConfigs.resolvers
  ]
});

module.exports = schema;
