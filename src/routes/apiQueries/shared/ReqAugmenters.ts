import {
  ApiQueryName,
  QueryReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { Obj } from "../../../client/src/App/sharedWithServer/utils/Obj";
import { UserJwt } from "./DbSections/LoadedDbUser/userAuthToken";

export type LoggedInReq<QN extends ApiQueryName> = LoggedIn<QueryReq<QN>>;
export type LoggedIn<T extends any> = T & LoggedInReqBase;
type LoggedInReqBase = {
  body: { userJwt: UserJwt };
};

export type Authed<T extends any> = T & AuthedReqBase;
type AuthedReqBase = {
  body: {
    auth: AuthData;
  };
};

type AuthData = {
  id: string;
};

export function isAuthObject(value: any): value is AuthData {
  if (Obj.isObjToAny(value) && typeof value.id === "string") {
    return true;
  } else return false;
}
