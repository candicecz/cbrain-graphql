const { gql, makeExecutableSchema } = require("apollo-server");
const R = require("ramda");
const sessions = require("./sessions");
const groups = require("./groups");
const users = require("./users");
const toolConfigs = require("./toolConfigs");
const tags = require("./tags");
const bourreaux = require("./bourreaux");

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
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [
    typeDefs,
    sessions.typeDefs,
    groups.typeDefs,
    users.typeDefs,
    toolConfigs.typeDefs,
    tags.typeDefs,
    bourreaux.typeDefs
  ],
  resolvers: [
    sessions.resolvers,
    groups.resolvers,
    users.resolvers,
    toolConfigs.resolvers,
    tags.resolvers,
    bourreaux.resolvers
  ]
});

module.exports = schema;
