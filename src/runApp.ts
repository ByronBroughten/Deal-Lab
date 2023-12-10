require("express-async-errors");
require("dotenv").config();
import config from "config";
import express from "express";
import { runStartup } from "./runStartup";
import { logger } from "./runStartup/logger";
import { useErrorHandling } from "./useErrorHandling";
import { useInitializeApp } from "./useInitializeApp";
import { useCoreRoutes } from "./useRoutes/useCoreRoutes";
import { useStripeWebhooks } from "./useRoutes/useStripeWebhooks";

export function runApp() {
  runStartup();
  const app = express();
  useInitializeApp(app);
  useStripeWebhooks(app);
  useCoreRoutes(app);
  useErrorHandling(app);

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
