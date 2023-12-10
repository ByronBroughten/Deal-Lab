import { ResStatusError } from "../../handleErrors";

export function missingTokenError(whatNotPresent: string) {
  return new ResStatusError({
    errorMessage: `No ${whatNotPresent} present on req`,
    resMessage: "That didn't work. You are not properly logged in.",
    status: 401,
  });
}
