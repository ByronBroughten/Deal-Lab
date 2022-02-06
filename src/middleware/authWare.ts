import express from "express";

import { authTokenKey } from "../sharedWithServer/User/crudTypes";
import { decodeAndCheckUserToken } from "./routes/userRoutes/login";

export default function authWare(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const token = req.header(authTokenKey);
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = decodeAndCheckUserToken(token);
    if (!decoded) throw new Error();
    req.body.user = decoded;
    next();
  } catch (ex) {
    res.status(401).send("Access denied. Invalid token provided.");
  }
}
