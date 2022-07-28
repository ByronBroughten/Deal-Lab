import {
  ApiQueryName,
  QueryReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { UserJwt } from "./DbSections/DbUser/userAuthToken";

export type UserAuthedReq<QN extends ApiQueryName> = LoggedIn<QueryReq<QN>>;
export type LoggedIn<T extends any> = T & LoggedInReq;
type LoggedInReq = {
  body: { userJwt: UserJwt };
};
