import { NextFunction, Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { missingTokenError } from "./middlewareShared/missingTokenError";

export function getAuthWare() {
  return [verifySession(), standardizeAuthWare];
}

function standardizeAuthWare(
  req: SessionRequest,
  _: Response,
  next: NextFunction
) {
  const session = req.session;
  if (!session) throw missingTokenError("session");
  req.body.auth = {
    id: session.getUserId(),
  };
  next();
}
