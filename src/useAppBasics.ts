import compression from "compression";
import config from "config";
import Debug from "debug";
import { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";

export function useAppBasics(app: Express): void {
  const debug = Debug("app:startup");
  if (config.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Morgan enabled...");
  }
  app.use(helmet());
  app.use(compression());
}
