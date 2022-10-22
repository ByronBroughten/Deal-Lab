import cors from "cors";
import express from "express";
import supertokens from "supertokens-node";
import { errorHandler, middleware } from "supertokens-node/framework/express";
import { constants } from "../client/src/App/Constants";
import { apiQueriesServer } from "../routes/apiQueries";
import { initSupertokens } from "./initSupertokens";

export function useRoutes(app: express.Application) {
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
        "http://localhost:3000",
        "https://ultimate-property-analyzer.herokuapp.com",
        "https://www.ultimatepropertyanalyzer.com",
      ],
      allowedHeaders: [
        constants.tokenKey.userAuthData,
        "content-type", // supertokens needs content-type header
        ...supertokens.getAllCORSHeaders(),
      ],
      credentials: true,
      exposedHeaders: [constants.tokenKey.userAuthData],
    })
  );

  app.use(middleware());
  app.use(constants.apiPathBit, apiQueriesServer);
  app.use(errorHandler());
}
