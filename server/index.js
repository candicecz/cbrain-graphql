const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const server = new ApolloServer({
  context: async ({ req }) => {
    const baseURL = "http://localhost:3005/";

    const headers = {
      accept: "application/json",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "content-type": "application/x-www-form-urlencoded"
    };

    const user = req.headers.authorization
      ? await resolvers.Query.getSession(null, null, {
          headers: { ...headers, authorization: req.headers.authorization },
          baseURL
        })
      : null;

    return {
      baseURL,
      headers: {
        ...headers,
        authorization: req.headers.authorization || "",
        user
      }
    };
  },

  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
