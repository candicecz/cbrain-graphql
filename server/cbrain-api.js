const qs = require("qs");
const fetch = require("node-fetch");

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
      throw {
        status: res.status,
        success: res.status === 200 && res.status === 201,
        statusText: res.statusText
      };
    }
    return res;
  } catch (err) {
    throw new Error(`${err.status} - ${err.statusText}`);
  }
};

module.exports = fetchCbrain;
