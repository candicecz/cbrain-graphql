const { gql } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");
const GraphQLJSON = require("graphql-type-json");
const { GraphQLUpload } = require("graphql-upload");
const bourreaux = require("./Bourreaux/");
const dataProviders = require("./DataProviders/");
const groups = require("./Groups/");
const sessions = require("./Sessions/");
const tags = require("./Tags/");
const tasks = require("./Tasks/");
const taskParameters = require("./TaskParameters/");
const toolConfigs = require("./ToolConfigs/");
const tools = require("./Tools/");
const userfiles = require("./Userfiles/");
const users = require("./Users/");

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
  }

  type Heading {
    header: String!
    accessor: String!
  }

  #  [TO DO] This field should be added to all feed types.
  #  The shape of the PageInfo type is TBD by the api once it returns some
  #  indication of cursor or hasNext, etc.
  #  [NOTE] in feed fields the cursor argument should be removed in favour of
  #  "page" depending on what is used.
  type PageInfo {
    hasPrevious: Boolean!
    hasNext: Boolean!
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

const createLoaders = context => {
  return {
    ...groups.loaders(context),
    ...dataProviders.loaders(context),
    ...users.loaders(context),
    ...userfiles.loaders(context),
    ...tasks.loaders(context),
    ...bourreaux.loaders(context)
  };
};

module.exports = { schema, createLoaders };
