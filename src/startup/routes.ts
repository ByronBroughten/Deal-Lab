import cors from "cors";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { config } from "../client/src/App/Constants";
import { authTokenKey } from "../client/src/App/sharedWithServer/Crud";
import { gqlSchema } from "../graphlq";
import apiQueriesServer from "../routes/apiQueriesServer";

export default function routes(app: express.Application) {
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://ultimate-property-analyzer.herokuapp.com",
        "https://dealanalyzer.app",
      ],
      credentials: true,
      exposedHeaders: [authTokenKey],
    })
  );
  app.use(express.json()); // parses body into a JSON object
  app.use(
    "/graphql",
    graphqlHTTP({
      schema: gqlSchema,
      graphiql: true,
    })
  );

  app.use(config.apiPathBit, apiQueriesServer);
}
