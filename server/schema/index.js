const { gql } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");
const GraphQLJSON = require("graphql-type-json");
const { GraphQLUpload } = require("graphql-upload");
const sessions = require("./sessions");
const groups = require("./groups");
const users = require("./users");
const toolConfigs = require("./toolConfigs");
const tags = require("./tags");
const bourreaux = require("./bourreaux");
const dataProviders = require("./dataProviders");
const tasks = require("./tasks");
const taskParameters = require("./taskParameters");
const tools = require("./tools");
const userfiles = require("./userfiles");

const typeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Response {
    success: Boolean!
    status: Int
    message: String
  }

  enum Order {
    ASC
    DESC
  }

  scalar JSON
  scalar Upload
`;

const resolvers = {
  JSON: GraphQLJSON,
  Upload: GraphQLUpload
};

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
    taskParameters.typeDefs,
    tools.typeDefs,
    userfiles.typeDefs
  ],
  resolvers: [
    resolvers,
    sessions.resolvers,
    groups.resolvers,
    users.resolvers,
    toolConfigs.resolvers,
    tags.resolvers,
    bourreaux.resolvers,
    dataProviders.resolvers,
    tasks.resolvers,
    taskParameters.resolvers,
    tools.resolvers,
    userfiles.resolvers
  ]
});

module.exports = schema;
