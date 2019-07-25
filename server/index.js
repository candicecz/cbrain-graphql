const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");
const schema = require("./schema");

require("dotenv").config();

const { resolvers } = require("./schema/sessions");
const cors = {
  origin:
    process.env.NODE_ENV === "production"
      ? "*"
      : `${process.env.CLIENT_ENDPOINT}`,
  credentials: true
};

const BASE_HEADERS = {
  accept: "application/json",
  "accept-language": "en-GB,en-US;q=0.9,en;q=0.8"
};

const BASE_URL = `${process.env.CBRAIN_ENDPOINT}/`;

const server = new ApolloServer({
  context: ({ req, res }) => {
    const token = req.session.token || null;

    return {
      req,
      res,
      baseURL: BASE_URL,
      headers: {
        ...BASE_HEADERS,
        authorization: token ? `Bearer ${token}` : null,
        token: token || null
      }
      // user: { userId: req.session.userId }
    };
  },
  schema
});

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  session({
    name: "uid",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    cookie: {
      secure: process.env.NODE_ENV === "production"
      // maxAge: 1000 * 60 * 60 * 24
    }
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

server.applyMiddleware({ app, cors });

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server ready on port ${process.env.PORT}`); // eslint-disable-line no-console
});
