const { ApolloServer } = require("apollo-server");
const schema = require("./schema");

require("dotenv").config();

const { resolvers } = require("./schema/sessions");

const server = new ApolloServer({
  context: async ({ req }) => {
    const baseURL = `${process.env.CBRAIN_ENDPOINT}/`;

    const headers = {
      accept: "application/json",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    };
    const user = req.headers.authorization
      ? await resolvers.Query.session(null, null, {
          headers: { ...headers, authorization: req.headers.authorization },
          baseURL
        })
      : null;
    return {
      baseURL,
      headers: {
        ...headers,
        authorization: req.headers.authorization || ""
      },
      user
    };
  },
  schema
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
