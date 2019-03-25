const { gql } = require("apollo-server");
const fetch = require("../cbrain-api");
const { paginateResults } = require("../utils");

const typeDefs = gql`
  extend type Query {
    getUser(id: ID!): User
    getUsers(pageSize: Int, after: String): UserPagination!
  }

  extend type Mutation {
    createUser(input: UserInput): User
    deleteUser(id: ID!): Response
    updateUser(id: ID!, input: UserInput): User
  }

  input UserInput {
    id: ID
    login: String!
    password: String!
    passwordConfirmation: String!
    fullName: String!
    email: String
    city: String
    country: String
    timeZone: String
    type: String
    siteId: Int
    lastConnected: String
    accountLocked: String
  }

  type User {
    id: ID
    login: String
    password: String
    passwordConfirmation: String
    fullName: String
    email: String
    city: String
    country: String
    timeZone: String
    type: String
    siteId: Int
    lastConnected: String
    accountLocked: String
  }

  type UserPagination {
    cursor: String!
    hasMore: Boolean!
    users: [User]!
  }
`;

const resolvers = {
  Query: {
    getUsers: async (_, { pageSize, after }, context) => {
      const allUsers = await fetch(context, "users")
        .then(data => data.json())
        .then(users => users.map(user => formData(user)))
        .catch(err => err);
      const users = paginateResults({
        after,
        pageSize,
        results: allUsers
      });
      return {
        users,
        cursor: users.length ? users[users.length - 1].cursor : null,
        hasMore: users.length
          ? users[users.length - 1].cursor !==
            allUsers[allUsers.length - 1].cursor
          : false
      };
    },
    getUser: (_, { id }, context) => {
      return fetch(context, `users/`, { method: "GET" }, { id })
        .then(data => data.json())
        .then(user => formData(user[0]))
        .catch(err => err);
    }
  },
  Mutation: {
    createUser: (_, { input }, context) => {
      const user = {
        ...input,
        password_confirmation: input.passwordConfirmation,
        full_name: input.fullName,
        time_zone: input.timeZone,
        site_id: input.siteId,
        last_connecte_at: input.lastConnected
      };
      return fetch(context, "users", { method: "POST" }, { user })
        .then(data => data.json())
        .then(user => formData(user));
    },
    updateUser: (_, { id, input }, context) => {
      const user = {
        ...input,
        password_confirmation: input.passwordConfirmation,
        full_name: input.fullName,
        time_zone: input.timeZone,
        site_id: input.siteId,
        last_connected_at: input.lastConnected
      };
      return fetch(context, `users/${id}`, { method: "PUT" }, { user })
        .then(data => data.json())
        .then(user => formData(user))
        .catch(err => err);
    },
    deleteUser: (_, { id }, context) => {
      return fetch(context, `users/${id}`, { method: "DELETE" })
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

const formData = user => {
  return {
    id: user.id,
    login: user.login,
    password: user.password,
    passwordConfirmation: user.password_confirmation,
    fullName: user.full_name,
    email: user.email,
    city: user.city,
    country: user.country,
    timeZone: user.time_zone,
    type: user.type,
    siteId: user.site_id,
    lastConnected: user.last_connected_at,
    accountLocked: user.accountLocked
  };
};

module.exports = { typeDefs, resolvers };
