require("express-async-errors");
import express from "express";
import morgan from "morgan";
import Debug from "debug";
import routes from "./startup/routes";
import startDb from "./startup/db";
import checkConfig from "./startup/config";
import config from "config";
import error from "./middleware/error";
import helmet from "helmet";
import compression from "compression";
import setupLogger, { logger } from "./startup/setupLogger";

export function runApp() {
  checkConfig();
  startDb();
  setupLogger();

  const app = express();
  app.use(helmet());
  app.use(compression());
  app.use(express.urlencoded({ extended: true }));
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

  routes(app);
  app.use(error);
  if (process.env.NODE_ENV === "production") {
    app.get("*", function (req, res) {
      res.sendFile("index.html", { root: "src/client/build/" });
    });
  }

  const port = process.env.PORT || config.get("port");
  const server = app.listen(port, () =>
    logger.info(`Listening on port ${port}...`)
  );
  return server;
}
