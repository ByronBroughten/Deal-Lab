import compression from "compression";
import config from "config";
import Debug from "debug";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";

export function useInitializeApp(app: Express): void {
  const debug = Debug("app:startup");
  if (config.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Morgan enabled...");
  }
  app.use(helmet());
  app.use(compression());
  if (process.env.NODE_ENV === "production") {
    app.use(express.static("src/client/build"));
  } else {
    app.use(express.static("public"));
  }
}
