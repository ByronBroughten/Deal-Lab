import cors from "cors";
import express from "express";
import supertokens from "supertokens-node";
import { errorHandler, middleware } from "supertokens-node/framework/express";
import { constants } from "../client/src/App/Constants";
import apiQueriesServer from "../routes/apiQueries";
import { useSupertokensInit } from "./useSupertokensInit";

export function useRoutes(app: express.Application) {
  app.use(express.json()); // parses body into a JSON object
  useSupertokensInit();
  app.use(
    cors({
      origin: [
        constants.clientUrlBase,
        "http://localhost:3000",
        "https://ultimate-property-analyzer.herokuapp.com",
        "https://dealanalyzer.app",
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
  app.use(middleware());
  app.use(constants.apiPathBit, apiQueriesServer);
  app.use(errorHandler());
}
