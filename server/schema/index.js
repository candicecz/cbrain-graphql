const { gql } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");
const R = require("ramda");
const sessions = require("./sessions");
const groups = require("./groups");
const users = require("./users");
const toolConfigs = require("./toolConfigs");
const tags = require("./tags");
const bourreaux = require("./bourreaux");
const dataProviders = require("./dataProviders");
const tasks = require("./tasks");
const tools = require("./tools");

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
  enum Order {
    ASC
    DESC
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
    bourreaux.typeDefs,
    dataProviders.typeDefs,
    tasks.typeDefs,
    tools.typeDefs
  ],
  resolvers: [
    sessions.resolvers,
    groups.resolvers,
    users.resolvers,
    toolConfigs.resolvers,
    tags.resolvers,
    bourreaux.resolvers,
    dataProviders.resolvers,
    tasks.resolvers,
    tools.resolvers
  ]
});

module.exports = schema;
