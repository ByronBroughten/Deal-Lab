import mongoose from "mongoose";
import { dbConfig } from "./dbConfig";
import { logger } from "./setupLogger";

export default function startDb() {
  const endpoint = dbConfig.endpoint;
  mongoose
    .connect(endpoint, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => logger.info(`Connected to ${endpoint}...`));
}
