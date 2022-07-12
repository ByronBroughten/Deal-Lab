import {
  ApiQueryName,
  QueryReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { ResStatusError } from "../../../resErrorUtils";

export type UserAuthedReq<QN extends ApiQueryName> = LoggedIn<QueryReq<QN>>;
export type LoggedIn<T extends any> = T & LoggedInReq;
export type LoggedInUser = { _id: string };
type LoggedInReq = {
  body: {
    user: LoggedInUser;
  };
};

export function validateLoggedInUser(value: any): LoggedInUser {
  if (isLoggedInUser(value)) return value;
  else {
    throw new ResStatusError({
      errorMessage: "Made request without being logged in.",
      resMessage: "You are not logged in.",
      status: 400,
    });
  }
}

function isLoggedInUser(value: any): value is LoggedInUser {
  if (typeof value === "object" && typeof value._id === "string") return true;
  else return false;
}
