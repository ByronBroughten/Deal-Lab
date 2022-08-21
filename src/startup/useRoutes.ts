import cors from "cors";
import express from "express";
import supertokens from "supertokens-node";
import { errorHandler, middleware } from "supertokens-node/framework/express";
import { constants } from "../client/src/App/Constants";
import { apiQueriesServer } from "../routes/apiQueries";
import { initSupertokens } from "./initSupertokens";

export function useRoutes(app: express.Application) {
  // app.use(
  //   (req, res, next): void => {
  //     if (req.originalUrl === '/webhook') {
  //       next();
  //     } else {
  //       express.json()(req, res, next);
  //     }
  //   }
  // );
  // app.use(express.json());
  app.use((req, res, next) => {
    if (req.originalUrl.includes("/webhook")) {
      next();
    } else {
      express.json()(req, res, next);
    }
  });
  initSupertokens();
  app.use(
    cors({
      origin: [
        constants.clientUrlBase,
        "http://localhost:3000",
        "https://ultimate-property-analyzer.herokuapp.com",
      ],
      allowedHeaders: [
        constants.tokenKey.apiUserAuth,
        "content-type", // supertokens needs content-type header
        ...supertokens.getAllCORSHeaders(),
      ],
      credentials: true,
      exposedHeaders: [constants.tokenKey.apiUserAuth],
    })
  );

  if (process.env.NODE_ENV !== "test") {
    app.use(middleware());
  }

  app.use(constants.apiPathBit, apiQueriesServer);
  app.use(errorHandler());
}
