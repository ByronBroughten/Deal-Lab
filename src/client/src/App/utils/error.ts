export class HandledError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function errorToHandledError(error: unknown): HandledError {
  return new HandledError(getErrorMessage(error));
}
type ErrorWithMessage = {
  message: string;
};
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

export function toError(something: unknown): Error {
  if (something instanceof Error) return something;
  try {
    return new Error(JSON.stringify(something));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(something));
  }
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}
