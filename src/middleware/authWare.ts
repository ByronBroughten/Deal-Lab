import { NextFunction, Request, Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { constants } from "../client/src/App/Constants";
import { LoadedDbUser } from "../routes/apiQueries/shared/DbSections/LoadedDbUser";
import { LoggedInReq } from "../routes/apiQueries/shared/ReqAugmenters";
import { ResStatusError } from "../utils/resError";

export function checkUserInfoWare(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const token = req.header(constants.tokenKey.apiUserAuth);
  if (!token) throw missingTokenError("userJwt");
  const decoded = LoadedDbUser.checkUserAuthToken(token);
  (req as LoggedInReq<any>).body.userJwt = decoded;
  next();
}

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

function missingTokenError(whatNotPresent: string) {
  return new ResStatusError({
    errorMessage: `No ${whatNotPresent} present on req`,
    resMessage: "That didn't work. You are not properly logged in.",
    status: 401,
  });
}
