const { gql } = require("apollo-server");
const fetchCbrain = require("../cbrain-api");

const typeDefs = gql`
  extend type Query {
    session: Session
  }
  extend type Mutation {
    login(login: String!, password: String!): Session
    logout: Response
  }

  type Session {
    userId: ID
    token: String
    message: String
  }
`;

const resolvers = {
  Query: {
    session: (_, __, context) => {
      return fetchCbrain(context, "session")
        .then(data => data.json())
        .then(session => {
          return {
            userId: session.user_id
          };
        })
        .catch(err => {
          if (!context.headers.authorization) {
            return { message: "Must be logged in" };
          }
          return { message: err };
        });
    }
  },
  Mutation: {
    login: (_, { login, password }, context) => {
      const { req } = context;
      const query = {
        login,
        password
      };
      return fetchCbrain(context, "session", { method: "POST" }, query)
        .then(data => data.json())
        .then(session => {
          req.session.token = session.cbrain_api_token;
          req.session.userId = session.user_id;

          return {
            userId: session.user_id
          };
        });
    },
    logout: (_, __, context) => {
      const { res } = context;

      return fetchCbrain(context, "session", { method: "DELETE" })
        .then(session => {
          res.clearCookie("uid", { path: "/" });
          return {
            status: session.status,
            success: session.status === 200
          };
        })
        .catch(err => err);
    }
  }
};

module.exports = { typeDefs, resolvers };
