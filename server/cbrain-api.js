const qs = require("qs");
const fetch = require("node-fetch");

const fetchCbrain = async (
  context,
  route,
  fetchParams = { method: "GET" },
  query
) => {
  const { headers, ...rest } = fetchParams;
  console.log(
    `${context.baseURL}${route}${
      query ? "?" + qs.stringify(query, { encodeValuesOnly: true }) : ""
    }`
  );

  let res = await fetch(
    `${context.baseURL}${route}${
      query ? "?" + qs.stringify(query, { encodeValuesOnly: true }) : ""
    }`,
    {
      headers: { ...context.headers, ...headers },
      ...rest
    }
  );
  if (res.status !== 200 && res.status !== 201) {
    throw new Error("Fetch Failed");
  }
  return res;
};

module.exports = fetchCbrain;
