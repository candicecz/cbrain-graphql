const { gql } = require("apollo-server");

const typeDefs = gql`
  extend type Query {
    getBourreauById(id: ID!): Bourreau

    getBourreaux(
      cursor: Int
      limit: Int
      sortBy: BourreauSort
      orderBy: Order
    ): BourreauFeed!
  }

  type Bourreau {
    id: ID
    name: String
    userId: ID
    groupId: ID
    online: Boolean
    readOnly: Boolean
    description: String
  }

  type BourreauFeed {
    cursor: Int!
    hasMore: Boolean!
    bourreaux: [Bourreau]
  }

  enum BourreauSort {
    id
    name
    userId
    groupId
    description
  }
`;

module.exports = { typeDefs };
