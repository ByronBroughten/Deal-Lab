import config from "config";
import cors from "cors";
import express from "express";
import supertokens from "supertokens-node";
import { errorHandler, middleware } from "supertokens-node/framework/express";
import { constants } from "../client/src/sharedWithServer/Constants";
import { useApiQueries } from "./useApiQueries";

const superTokensExpress = {
  middleware,
  errorHandler,
} as const;

export function useCoreRoutes(app: express.Express) {
  app.use(express.json({ limit: config.get("reqSizeLimit") }));
  app.use(
    express.urlencoded({ extended: true, limit: config.get("reqSizeLimit") })
  );

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        // "https://ultimate-property-analyzer.herokuapp.com",
        // "https://www.ultimatepropertyanalyzer.com",
        "https://www.homeestimator.net",
        "https://the.homeestimator.net",
        "https://app.homeestimator.net",
        "https://www.deallab.app",
        "https://the.deallab.app",
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

  app.use(superTokensExpress.middleware());
  useApiQueries(app);
  app.use(superTokensExpress.errorHandler());
}
