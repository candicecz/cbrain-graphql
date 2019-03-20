const fetch = require("./cbrain-api");

const resolvers = {
  Query: {
    getSession: (_, __, context) => {
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
        login: encodeURIComponent(login),
        password: encodeURIComponent(password)
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
            success: res.status === 200,
            message: `${
              res.status === 200
                ? res.status + ": Logout Successful"
                : res.status + ": Logout Failed"
            }`
          };
        })
        .catch(err => err);
    }
  }
};

module.exports = resolvers;
