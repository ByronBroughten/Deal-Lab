import config from "config";
import { checkConfig } from "./runStartup/checkConfig";
import { initSupertokens } from "./runStartup/initSupertokens";
import { logger, setupLogger } from "./runStartup/logger";
import { startDb } from "./runStartup/startDb";

export function runStartup(): void {
  setupLogger();
  logger.info(`Running in a ${config.get("env")} environment...`);
  checkConfig();
  startDb();
  initSupertokens();
}
