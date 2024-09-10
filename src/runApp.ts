require("express-async-errors");
require("dotenv").config();
import config from "config";
import express from "express";
import { runStartup } from "./runApp/runStartup";
import { logger } from "./runApp/runStartup/logger";
import { useBasics } from "./runApp/useBasics";
import { useErrorHandling } from "./runApp/useErrorHandling";
import { useCoreRoutes } from "./runApp/useRoutesCore";
import { useStripeRoutes } from "./runApp/useRoutesStripe";

export function runApp() {
  runStartup();
  const app = express();
  useBasics(app);
  useStripeRoutes(app);
  useCoreRoutes(app);
  useErrorHandling(app);

  if (config.get("env") === "production") {
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
