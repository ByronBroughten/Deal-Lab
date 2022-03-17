import express from "express";
import { authTokenKey } from "../client/src/App/sharedWithServer/User/crudTypes";
import { serverSideLogin } from "./routes/userRoutes/shared/doLogin";

export default function authWare(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const token = req.header(authTokenKey);
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = serverSideLogin.checkUserAuthToken(token);
    if (!decoded) throw new Error();
    req.body.user = decoded;
    next();
  } catch (ex) {
    res.status(401).send("Access denied. Invalid token provided.");
  }
}
