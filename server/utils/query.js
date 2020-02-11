const fetch = require("node-fetch");
const humps = require("humps");
const R = require("ramda");

const { AuthenticationError, ApolloError } = require("apollo-server-express");

const query = async (context, relativeURL, req) => {
  try {
    const response = await fetch(`${context.baseURL + relativeURL}`, {
      headers: {
        ...context.headers
      },
      ...req
    });

    if (response.status !== 200 && response.status !== 201) {
      throw response;
    }
    try {
      // Parses the response body as json
      const data = await response.json();
      return data && humps.camelizeKeys(data);
    } catch (err) {
      // Returns the response status if the body is not JSON
      return {
        status: response.status,
        success: response.status === (200 || 201)
      };
    }
  } catch (err) {
    if (err.status === 401) {
      throw new AuthenticationError(`${err.statusText}`);
    }
    throw new ApolloError(err.statusText, err.status, { url: err.url });
  }
};

module.exports = query;
