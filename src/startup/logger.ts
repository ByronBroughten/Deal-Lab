import config from "config";
import winston from "winston";
import "winston-mongodb";

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.simple()
);

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

export function setupLogger() {
  const consoleTransport = new winston.transports.Console({
    level: "error",
    format: consoleFormat,
  });
  const fileTransport = new winston.transports.File({
    level: "error",
    filename: "logfile.log",
    handleExceptions: true,
    //@ts-ignore
    // handleRejections: true,
  });
  const mongoTransport = new winston.transports.MongoDB({
    level: "error",
    db: config.get("endpoint"),
    options: { useUnifiedTopology: true },
  });

  winston.add(consoleTransport);
  winston.add(fileTransport);
  winston.add(mongoTransport);

  winston.exceptions.handle(consoleTransport, fileTransport, mongoTransport);
  process.on("unhandledRejection", (ex: Error) => {
    throw ex;
  });
}
