import { NextFunction, Request, Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { constants } from "../client/src/App/Constants";
import { LoadedDbUser } from "../routes/apiQueries/shared/DbSections/LoadedDbUser";
import { createDbAccessToken } from "../routes/apiQueries/shared/DbSections/LoadedDbUser/userAuthToken";
import {
  LoggedIn,
  LoggedInReq,
} from "../routes/apiQueries/shared/ReqAugmenters";
import { ResStatusError } from "../utils/resError";
import { getStandardNow } from "./../client/src/App/sharedWithServer/utils/date";

export function checkDbAccessWare(
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
// no no. I should have a separate route for this.
export async function updateUserSubscriptionWare(
  req: LoggedIn<Request>,
  res: Response,
  next: NextFunction
) {
  const { userJwt } = req.body;
  const { subscriptionPlan, planExp, userId } = userJwt;
  if (subscriptionPlan === "fullPlan" && planExp < getStandardNow()) {
    const user = await LoadedDbUser.getBy("userId", userId);
    user.setResTokenHeader(res);
  } else {
    const token = createDbAccessToken(userJwt);
    LoadedDbUser.setResTokenHeader(res, token);
  }
  next();
}

function missingTokenError(whatNotPresent: string) {
  return new ResStatusError({
    errorMessage: `No ${whatNotPresent} present on req`,
    resMessage: "That didn't work. You are not properly logged in.",
    status: 401,
  });
}
