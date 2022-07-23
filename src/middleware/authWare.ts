import express from "express";
import { config } from "../client/src/App/Constants";
import { DbUser } from "../routes/apiQueries/shared/DbSections/DbUser";
import { UserAuthedReq } from "../routes/apiQueries/shared/UserAuthedReq";

export function userAuthWare(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const token = req.header(config.tokenKey.apiUserAuth);
  if (!token) return res.status(401).send("Access denied. No token provided.");
  const decoded = DbUser.checkUserAuthToken(token);
  (req as UserAuthedReq<any>).body.userJwt = decoded;
  next();
}
