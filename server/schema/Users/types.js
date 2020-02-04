const { gql } = require("apollo-server");

/* 
Note: There are two types of input: UserInput and UpdateUserInput 
which are used for create and update respectively. They each contain
fields UserInfo and UpdateUserInfo. The reasons for this is that
they have different required fields and we shouldn't ask the user to input
a password if they want to edit their profile.
*/
const typeDefs = gql`
  extend type Query {
    user(id: ID!): User
    users(cursor: Int, limit: Int, sortBy: UserSort, orderBy: Order): UserFeed!
  }

  extend type Mutation {
    createUser(input: UserInput): User
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
    password: String
    passwordConfirmation: String
    fullName: String
    email: String
    city: String
    country: String
    timeZone: String
    type: UserType
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
    feed: [User]!
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

module.exports = { typeDefs };
