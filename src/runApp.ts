require("express-async-errors");
import compression from "compression";
import config from "config";
import Debug from "debug";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { constants } from "./client/src/App/Constants";
import { errorBackstop } from "./middleware/errorBackstop";
import { webhookQueries } from "./routes/webhookQueries";
import checkConfig from "./startup/config";
import setupLogger, { logger } from "./startup/setupLogger";
import { startDb } from "./startup/startDb";
import { useRoutes } from "./startup/useRoutes";
import { reqSizeLimit } from "./utils/express";

export function runApp() {
  checkConfig();
  startDb();
  setupLogger();

  const app = express();
  app.use(constants.apiPathBit, webhookQueries);
  app.use(helmet());
  app.use(compression());
  app.use(express.urlencoded({ extended: true, limit: reqSizeLimit }));

  logger.info(`Running in a ${process.env.NODE_ENV} environment...`);
  if (process.env.NODE_ENV === "production") {
    app.use(express.static("src/client/build"));
  } else {
    app.use(express.static("public"));
  }

  const debug = Debug("app:startup");
  if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Morgan enabled...");
  }

  useRoutes(app);
  app.use(errorBackstop);
  if (process.env.NODE_ENV === "production") {
    app.get("*", function (_, res) {
      res.sendFile("index.html", { root: "src/client/build/" });
    });
  }

  const port = process.env.PORT || config.get("port");
  const server = app.listen(port, () =>
    logger.info(`Listening on port ${port}...`)
  );
  return server;
}
