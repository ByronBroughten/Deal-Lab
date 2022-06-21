import { Response } from "express";
import { StrictOmit } from "./client/src/App/sharedWithServer/utils/types";
import { getErrorMessage } from "./client/src/App/utils/error";

export class ResHandledError extends Error {}

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
interface HandledResStatusErrorProps
  extends StrictOmit<ResStatusErrorProps, "errorMessage"> {}
export class HandledResStatusError extends ResStatusError {
  constructor(props: HandledResStatusErrorProps) {
    super({
      ...props,
      errorMessage: "handled",
    });
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
