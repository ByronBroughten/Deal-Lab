import cors from "cors";
import express from "express";
import supertokens from "supertokens-node";
import {
  errorHandler,
  middleware,
  SessionRequest,
} from "supertokens-node/framework/express";
import Session from "supertokens-node/recipe/session";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import { constants } from "../client/src/App/Constants";
import apiQueriesServer from "../routes/apiQueries";

supertokens.init({
  framework: "express",
  supertokens: {
    // try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
    connectionURI:
      "https://10c84041108411ed883e01b05b97929c-us-east-1.aws.supertokens.io:3573",
    apiKey: "9Fb5Qj2YNNoAbIAHDlvVRyg4IVoZU0",
  },
  appInfo: constants.superTokensAppInfo,
  recipeList: [
    ThirdPartyEmailPassword.init({}),
    Session.init(),
    // EmailPassword.init(), // initializes signin / sign up features
  ],
});

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

  app.use(middleware());
  app.get("/sessioninfo", verifySession(), async (req: SessionRequest, res) => {
    const session = req.session!;
    const userId = session.getUserId();
  });

  app.use(constants.apiPathBit, apiQueriesServer);
  app.use(errorHandler());
}
