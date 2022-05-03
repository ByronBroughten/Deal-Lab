import { Response } from "express";
import {
  ApiQueryName,
  NextReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { ResHandledError } from "../../../middleware/error";

export type UserAuthedReq<QN extends ApiQueryName> = LoggedIn<
  NextReq<"upgradeUserToPro">
>;
export type LoggedIn<T extends any> = T & LoggedInReq;
export type LoggedInUser = { _id: string };
type LoggedInReq = {
  body: {
    user: LoggedInUser;
  };
};

export function validateLoggedInUser(value: any, res: Response): LoggedInUser {
  if (isLoggedInUser(value)) return value;
  else {
    res.status(400).send("You are not logged in.");
    throw new ResHandledError("handled in validateLoggedInUser");
  }
}

function isLoggedInUser(value: any): value is LoggedInUser {
  if (typeof value === "object" && typeof value._id === "string") return true;
  else return false;
}
