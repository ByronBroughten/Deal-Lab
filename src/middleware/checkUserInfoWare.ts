import { NextFunction, Request, Response } from "express";
import { constants } from "../client/src/App/Constants";
import { LoadedDbUser } from "../routes/apiQueries/shared/DbSections/LoadedDbUser";
import { LoggedInReq } from "../routes/apiQueries/shared/ReqAugmenters";
import { missingTokenError } from "./middlewareShared/missingTokenError";

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
