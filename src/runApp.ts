require("express-async-errors");
import compression from "compression";
import config from "config";
import Debug from "debug";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { handleErrors } from "./handleErrors";
import { useStripeWebhooks } from "./routes/webhookQueries";
import { checkConfig } from "./startup/checkConfig";
import { logger, setupLogger } from "./startup/logger";
import { startDb } from "./startup/startDb";
import { useRoutes } from "./startup/useRoutes";
import { reqSizeLimit } from "./utils/express";

export function runApp() {
  checkConfig();
  startDb();
  setupLogger();

  const app = express();
  useStripeWebhooks(app);
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
  app.use(handleErrors);
  if (process.env.NODE_ENV === "production") {
    app.get("*", function (_, res) {
      res.sendFile("index.html", { root: "src/client/build/" });
    });
  }

  const port = config.get("port");
  const server = app.listen(port, () =>
    logger.info(`Listening on port ${port}...`)
  );
  return server;
}
