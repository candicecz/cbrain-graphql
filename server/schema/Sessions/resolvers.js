const qs = require("qs");

const relativeURL = "session";

const resolvers = {
  Query: {
    session: async (_, __, context) => {
      const { userId } = await context.query(relativeURL);
      return { userId };
    }
  },
  Mutation: {
    login: async (_, { login, password }, context) => {
      const { req } = context;
      const query_string = qs.stringify({
        login,
        password
      });
      const session = await context.query(`${relativeURL}?${query_string}`, {
        method: "POST"
      });
      req.session.token = session.cbrainApiToken;
      req.session.userId = session.userId;

      return { userId: session.userId };
    },
    logout: async (_, __, context) => {
      const { res } = context;

      const session = await context.query(`${relativeURL}`, {
        method: "DELETE"
      });
      res.clearCookie("sid", { path: "/" });
      return session;
    }
  }
};

module.exports = { resolvers };
