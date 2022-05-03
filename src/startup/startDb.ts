import mongoose from "mongoose";
import config from "config";
import { logger } from "./setupLogger";

export default function startDb() {
  const endpoint: string = config.get("endpoint");
  mongoose
    .connect(endpoint, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => logger.info(`Connected to ${endpoint}...`));
}
