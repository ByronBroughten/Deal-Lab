import {
  ApiQueryName,
  QueryReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { ResStatusError } from "../../../resErrorUtils";
import { isUserJwt, UserJwt } from "./DbSections/DbUser/userAuthToken";

export type UserAuthedReq<QN extends ApiQueryName> = LoggedIn<QueryReq<QN>>;
export type LoggedIn<T extends any> = T & LoggedInReq;
type LoggedInReq = {
  body: {
    userJwt: UserJwt;
  };
};
export function validateUserJwt(value: any): UserJwt {
  if (isUserJwt(value)) return value;
  else {
    throw new ResStatusError({
      errorMessage: "Made request without being logged in.",
      resMessage: "You are not logged in.",
      status: 400,
    });
  }
}
