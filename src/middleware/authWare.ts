import { NextFunction, Request, Response } from "express";
import { config } from "../client/src/App/Constants";
import { DbUser } from "../routes/apiQueries/shared/DbSections/DbUser";
import { createUserAuthToken } from "../routes/apiQueries/shared/DbSections/DbUser/userAuthToken";
import {
  LoggedIn,
  UserAuthedReq,
} from "../routes/apiQueries/shared/UserAuthedReq";
import { getStandardNow } from "./../client/src/App/sharedWithServer/utils/date";

export function userAuthWare(req: Request, res: Response, next: NextFunction) {
  const token = req.header(config.tokenKey.apiUserAuth);
  if (!token) return res.status(401).send("Access denied. No token provided.");
  const decoded = DbUser.checkUserAuthToken(token);
  (req as UserAuthedReq<any>).body.userJwt = decoded;
  next();
}

export async function userSubscriptionWare(
  req: LoggedIn<Request>,
  res: Response,
  next: NextFunction
) {
  const { userJwt } = req.body;
  const { subscriptionPlan, planExp, userId } = userJwt;
  if (subscriptionPlan === "fullPlan" && planExp < getStandardNow()) {
    const user = await DbUser.queryByUserId(userId);
    user.setResTokenHeader(res);
  } else {
    const token = createUserAuthToken(userJwt);
    DbUser.setResTokenHeader(res, token);
  }
  next();
}
