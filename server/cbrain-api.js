const qs = require("qs");
const fetch = require("node-fetch");

const fetchCbrainAPI = (
  context,
  route,
  fetchParams = { method: "GET" },
  query
) => {
  const { headers, ...rest } = fetchParams;
  console.log("headers", context.headers);
  console.log(
    `${context.baseURL}${route}${
      query ? "?" + qs.stringify(query, { encodeValuesOnly: true }) : ""
    }`
  );

  return fetch(
    `${context.baseURL}${route}${
      query ? "?" + qs.stringify(query, { encodeValuesOnly: true }) : ""
    }`,
    {
      headers: { ...context.headers, ...headers },
      ...rest
    }
  );
};

module.exports = fetchCbrainAPI;
