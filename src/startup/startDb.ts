import config from "config";
import mongoose from "mongoose";
import { logger } from "./logger";

export async function startDb() {
  const endpoint = config.get("endpoint") as string;
  await mongoose.connect(endpoint, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  logger.info(`Connected to ${endpoint}...`);
}
