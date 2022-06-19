import { NextFunction, Request, Response } from "express";
import winston from "winston";
import { ResHandledError } from "../resErrorUtils";

export function errorBackstop(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  winston.error(err.message, err);
  if (!(err instanceof ResHandledError)) {
    res.status(500).send("Something went wrong.");
  }
  next();
}
