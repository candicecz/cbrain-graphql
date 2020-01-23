const data = require("./data/");

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
