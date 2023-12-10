import { Express, NextFunction, Request, Response } from "express";
import winston from "winston";

interface ResStatusErrorProps {
  errorMessage: string;
  resMessage: string;
  status: number;
}
export class ResStatusError extends Error {
  readonly resMessage: string;
  readonly status: number;
  constructor({ errorMessage, resMessage, status }: ResStatusErrorProps) {
    super(errorMessage);
    this.resMessage = resMessage;
    this.status = status;
  }
}

export function useErrorHandling(app: Express): void {
  app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    winston.error(err.message, err);
    if (err instanceof ResStatusError) {
      const { resMessage, status } = err;
      res.status(status).send(resMessage);
    } else {
      res.status(500).send("Something went wrong.");
    }
    next();
  });
}
