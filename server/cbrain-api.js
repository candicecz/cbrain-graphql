const queryString = require("query-string");
const fetch = require("node-fetch");

// export const getUserById = ({ id, token }) => {
//   fetch(`http://localhost:3005/users/${id}`, {
//     headers: {
//       accept: "application/json",
//       "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
//       "content-type": "application/x-www-form-urlencoded",
//       authorization: `Bearer ${token}`
//     },
//     method: "GET",
//     mode: "no-cors"
//   })
//     .then(x => x.json())
//     .then(x => {
//       console.log(x);
//       return x;
//     })
//     .catch(e => console.log(e));
// };

const fetchCbrainAPI = async (
  context,
  route,
  fetchParams = { method: "GET" },
  query
) => {
  const { headers, ...rest } = fetchParams;
  console.log(context, fetchParams, route);

  return fetch(
    `${context.baseURL}${route}${
      query ? "?" + queryString.stringify(query) : ""
    }`,
    {
      headers: { ...context.headers, ...headers },
      ...rest
    }
  );
};

module.exports = fetchCbrainAPI;
