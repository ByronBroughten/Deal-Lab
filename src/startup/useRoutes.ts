import cors from "cors";
import express from "express";
import { constants } from "../client/src/App/Constants";
import apiQueriesServer from "../routes/apiQueries";

export function useRoutes(app: express.Application) {
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
  app.use(constants.apiPathBit, apiQueriesServer);
}
