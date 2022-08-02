import cors from "cors";
import express from "express";
import supertokens from "supertokens-node";
import {
  errorHandler,
  middleware,
  SessionRequest,
} from "supertokens-node/framework/express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { constants } from "../client/src/App/Constants";
import apiQueriesServer from "../routes/apiQueries";
import { useSupertokensInit } from "./useSupertokensInit";

export function useRoutes(app: express.Application) {
  app.use(express.json()); // parses body into a JSON object
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

  useSupertokensInit();
  app.use(middleware());
  app.post(
    "/initializeUserData",
    verifySession(),
    async (req: SessionRequest, res) => {
      const session = req.session!;
      const userId = session.getUserId();
      // Time to make a query.
      // Send the fe shared data or whatever it is.

      // Save each of those arrs to the database
      // Then make the serverUser and send to the front-end.
    }
  );

  app.use(constants.apiPathBit, apiQueriesServer);
  app.use(errorHandler());
}
