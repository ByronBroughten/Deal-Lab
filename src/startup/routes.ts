import cors from "cors";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { constants } from "../client/src/App/Constants";
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
      exposedHeaders: [constants.tokenKey.apiUserAuth],
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

  app.use(constants.apiPathBit, apiQueriesServer);
}
