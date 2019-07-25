const { gql } = require("apollo-server");
const fetchCbrain = require("../cbrain-api");
const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../utils");

const route = "users";

/* 
Note: There are two types of input: UserInput and UpdateUserInput 
which are used for create and update respectively. They each contain
fields UserInfo and UpdateUserInfo. The reasons for this is that
they have different required fields and we shouldn't ask the user to input
a password if they want to edit their profile.
*/
const typeDefs = gql`
  extend type Query {
    getUserById(id: ID!): User
    getUsers(
      cursor: Int
      limit: Int
      sortBy: UserSort
      orderBy: Order
    ): UserFeed!
  }

  extend type Mutation {
    createUser(input: UserInput): Response
    deleteUser(id: ID!): Response
    updateUser(id: ID!, input: UpdateUserInput): User
  }

  input UserInput {
    user: UserInfo
    noPasswordResetNeeded: Int
    forcePasswordReset: Boolean
  }

  input UserInfo {
    login: String!
    password: String!
    passwordConfirmation: String!
    fullName: String!
    email: String
    city: String
    country: String
    timeZone: String
    type: UserType!
    siteId: Int
    accountLocked: String
  }

  input UpdateUserInput {
    user: UpdateUserInfo
    noPasswordResetNeeded: Int
    forcePasswordReset: Boolean
  }

  input UpdateUserInfo {
    login: String
    password: String
    passwordConfirmation: String
    fullName: String
    email: String
    city: String
    country: String
    timeZone: String
    type: UserType!
    siteId: Int
    accountLocked: String
  }

  type User {
    id: ID
    login: String
    fullName: String
    email: String
    city: String
    country: String
    timeZone: String
    type: String
    siteId: Int
    lastConnectedAt: String
    accountLocked: String
  }

  type UserFeed {
    cursor: Int!
    hasMore: Boolean!
    users: [User]!
  }

  enum UserType {
    NormalUser
    SiteManager
    AdminUser
  }

  enum UserSort {
    id
    login
    fullName
    email
    city
    country
    lastConnection
    type
    siteId
    lastConnectedAt
  }
`;

const resolvers = {
  Query: {
    getUsers: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const results = await fetchCbrain(context, "users")
        .then(data => data.json())
        .then(users => users.map(user => camelKey(user)));
      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    },
    getUserById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`)
        .then(data => data.json())
        .then(user => camelKey(user));
    }
  },
  Mutation: {
    createUser: (_, { input }, context) => {
      const { user, ...rest } = snakeKey(input);
      return fetchCbrain(
        context,
        route,
        { method: "POST" },
        {
          user: snakeKey(user),
          ...rest
        }
      ).then(res => {
        return {
          status: res.status,
          success: res.status === 200
        };
      });
    },
    updateUser: (_, { id, input }, context) => {
      const { user, ...rest } = snakeKey(input);

      return fetchCbrain(
        context,
        `${route}/${id}`,
        { method: "PUT" },
        {
          user: snakeKey(user),
          ...rest
        }
      )
        .then(data => data.json())
        .then(user => camelKey(user));
    },
    deleteUser: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`, { method: "DELETE" }).then(
        res => {
          return {
            status: res.status,
            success: res.status === 200
          };
        }
      );
    }
  }
};

module.exports = { typeDefs, resolvers };
