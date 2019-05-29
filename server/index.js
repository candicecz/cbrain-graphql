const express = require("express");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");
const session = require("express-session");
const schema = require("./schema");
const { resolvers } = require("./schema/sessions");

require("dotenv").config();

const app = express();

const cors = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(
  session({
    name: "uid",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60
    }
  })
);

app.use(bodyParser.json());

const graphqlServer = new ApolloServer({
  context: ({ req }) => {
    const baseURL = `${process.env.CBRAIN_ENDPOINT}/`;
    const headers = {
      accept: "application/json",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8"
    };
    return { req, baseURL, headers };
  },
  schema
});

graphqlServer.applyMiddleware({ app, cors });

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server ready on port ${process.env.PORT}`); // eslint-disable-line no-console
});
