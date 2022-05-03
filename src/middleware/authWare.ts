import express from "express";
import { config } from "../client/src/App/Constants";
import { loginUtils } from "../routes/apiQueriesServer/nextLogin/loginUtils";

export default function authWare(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const token = req.header(config.tokenKey.apiUserAuth);
  if (!token) return res.status(401).send("Access denied. No token provided.");
  const decoded = loginUtils.checkUserAuthToken(token, res);
  req.body.user = decoded;
  next();
}
