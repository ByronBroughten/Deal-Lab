require("express-async-errors");
require("dotenv").config();
import config from "config";
import express from "express";
import { runStartup } from "./runStartup";
import { logger } from "./runStartup/logger";
import { useBasics } from "./useBasics";
import { useErrorHandling } from "./useErrorHandling";
import { useCoreRoutes } from "./useRoutes/useCoreRoutes";
import { useStripeWebhooks } from "./useRoutes/useStripeWebhooks";

export function runApp() {
  runStartup();
  const app = express();
  useBasics(app);
  useStripeWebhooks(app);
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
