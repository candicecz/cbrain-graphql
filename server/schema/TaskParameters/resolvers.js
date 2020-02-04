const data = require("./data/");

// [ NOTE ]: The API doesn't currently support task parameters,
// this is intended as a placeholder and not a long-term solution.

const resolvers = {
  Query: {
    getParamsByToolId: (_, { id }, context) => {
      const { task_params } = data;
      const param = task_params.filter((param, i) => +param.id === +id);
      return { params: param[0] };
    }
  }
};

module.exports = { resolvers };
