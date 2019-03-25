const { gql } = require("apollo-server");
const fetch = require("../cbrain-api");

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
      return fetch(context, "session")
        .then(data => data.json())
        .then(session => {
          return {
            userId: session.user_id,
            token: session.cbrain_api_token
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
      const query = {
        login,
        password
      };
      return fetch(context, "session", { method: "POST" }, query)
        .then(data => data.json())
        .then(session => {
          return {
            userId: session.user_id,
            token: session.cbrain_api_token
          };
        });
    },
    logout: (_, __, context) => {
      return fetch(context, "session", { method: "DELETE" })
        .then(res => {
          return {
            status: res.status,
            success: res.status === 200
          };
        })
        .catch(err => err);
    }
  }
};

module.exports = { typeDefs, resolvers };
