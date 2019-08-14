# CBRAIN GUI - GRAPHQL Layer

An apollo-graphql server to query the CBRAIN REST API

- Edit `server/env.template` into `server/.env` to configure the graphql server.
  - `CBRAIN_ENDPOINT` corresponds to the port where your local instance of CBRAIN is running.
  - `CLIENT_ENDPOINT` corresponds to the port where your user interface is running (used during development).
  - `PORT` corresponds to the port on which you are running this (graphql) server.
- Run `npm install` the first time.
- Run `npm run start` to start the graphql server.
