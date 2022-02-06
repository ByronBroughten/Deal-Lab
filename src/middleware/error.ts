import { Request, Response, NextFunction } from "express";
import winston from "winston";

export default function error(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  winston.error(err.message, err);
  res.status(500).send("Something went wrong.");
  next();
}
