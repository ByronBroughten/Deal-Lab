import { NextFunction, Request, Response } from "express";
import winston from "winston";

export class ResHandledError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export default function error(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  winston.error(err.message, err);
  if (!(Error instanceof ResHandledError)) {
    res.status(500).send("Something went wrong.");
  }
  next();
}
