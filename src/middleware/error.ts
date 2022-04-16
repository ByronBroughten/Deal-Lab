import { NextFunction, Request, Response } from "express";
import winston from "winston";
import { getErrorMessage } from "../client/src/App/utils/error";

export class ResHandledError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function resHandledError(
  res: Response,
  status: number,
  errOrMessage: unknown
) {
  res.status(status).send(errOrMessage);
  return new ResHandledError(getErrorMessage(errOrMessage));
}

export default function error(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  winston.error(err.message, err);
  if (!(Error instanceof ResHandledError)) {
    res.status(500).send("Something went wrong.");
  }
  next();
}
