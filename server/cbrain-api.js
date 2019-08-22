const qs = require("qs");
const fetch = require("node-fetch");
const { AuthenticationError } = require("apollo-server-express");

const fetchCbrain = async (
  context,
  route,
  fetchParams = { method: "GET" },
  query
) => {
  const { headers, ...rest } = fetchParams;
  try {
    let res = await fetch(
      `${context.baseURL}${route}${
        query
          ? "?" + qs.stringify(query, { encode: false, indices: false })
          : ""
      }`,
      {
        headers: {
          ...context.headers,
          ...headers
        },
        ...rest
      }
    );

    if (res.status !== 200 && res.status !== 201) {
      throw res;
    }
    return res;
  } catch (err) {
    if (err.status === 401) {
      throw new AuthenticationError(`${err.statusText}`);
    }
    throw new Error(`${err.status} - ${err.statusText}`);
  }
};

module.exports = fetchCbrain;
