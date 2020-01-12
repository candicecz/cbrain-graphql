const { gql } = require("apollo-server");
const fetchCbrain = require("../cbrain-api");
const data = require("./task_params/index");

const route = "task_params";

const typeDefs = gql`
  extend type Query {
    getParamsByToolId(id: ID!): Params
  }

  type Params {
    params: JSON
  }
`;

const resolvers = {
  Query: {
    getParamsByToolId: (_, { id }, context) => {
      const { task_params } = data;
      const param = task_params.filter((param, i) => +param.id === +id);
      return { params: param[0] };
    }
  }
};

module.exports = { typeDefs, resolvers };
