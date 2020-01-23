const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../../utils");
const fetchCbrain = require("../../cbrain-api");

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
        .catch(err => err);
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
        })
        .catch(err => err);
    },
    logout: (_, __, context) => {
      const { res } = context;

      return fetchCbrain(context, "session", { method: "DELETE" })
        .then(session => {
          res.clearCookie("sid", { path: "/" });
          return {
            status: session.status,
            success: session.status === 200
          };
        })
        .catch(err => err);
    }
  }
};

module.exports = { resolvers };
