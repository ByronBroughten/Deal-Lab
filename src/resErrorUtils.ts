import { Response } from "express";
import { getErrorMessage } from "./client/src/App/utils/error";

export class ResHandledError extends Error {}

type ResStatusErrorProps = {
  errorMessage: string;
  resMessage: string;
  status: number;
};
export class ResStatusError extends Error {
  readonly resMessage: string;
  readonly status: number;
  constructor({ errorMessage, resMessage, status }: ResStatusErrorProps) {
    super(errorMessage);
    this.resMessage = resMessage;
    this.status = status;
  }
}

export function handleResAndMakeError(
  res: Response,
  status: number,
  errOrMessage: unknown
) {
  res.status(status).send(errOrMessage);
  return new ResHandledError(getErrorMessage(errOrMessage));
}
