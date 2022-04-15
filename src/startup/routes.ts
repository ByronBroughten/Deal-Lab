import cors from "cors";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { config } from "../client/src/App/Constants";
import { authTokenKey } from "../client/src/App/sharedWithServer/Crud";
import { gqlSchema } from "../graphlq";
import apiQueriesServer from "../routes/apiQueriesServer";
import sectionArrRouter, { sectionArrRoutes } from "../routes/sectionArrRoutes";
import sectionRouter, { sectionRoutes } from "../routes/sectionRoutes";
import userRouter from "../routes/userRoutes";

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
  // oneRouter, right?

  app.use(sectionArrRoutes.route, sectionArrRouter);
  app.use(sectionRoutes.route, sectionRouter);

  // this won't work yet, because each of the routes in apiQueriesServer
  // have "api" at the front.

  // I need them to just have the bit
  // I'll start by getting rid of "user"

  app.use(config.url.user.route, userRouter);

  app.use(config.url.api.bit, apiQueriesServer);
}
