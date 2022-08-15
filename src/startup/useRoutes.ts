import cors from "cors";
import express from "express";
import supertokens from "supertokens-node";
import { errorHandler, middleware } from "supertokens-node/framework/express";
import { constants } from "../client/src/App/Constants";
import { apiQueriesServer, preParseWebhooks } from "../routes/apiQueries";
import { useSupertokensInit } from "./useSupertokensInit";

export function useRoutes(app: express.Application) {
  app.use(constants.apiPathBit, preParseWebhooks);

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
  useSupertokensInit();
  app.use(
    cors({
      origin: [
        constants.clientUrlBase,
        "http://localhost:3000",
        "https://ultimate-property-analyzer.herokuapp.com",
        "https://propertyanalyzer.app",
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
