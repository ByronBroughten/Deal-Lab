import {
  ApiQueryName,
  QueryReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { Obj } from "../../../client/src/App/sharedWithServer/utils/Obj";
import { Str } from "../../../client/src/App/sharedWithServer/utils/Str";
import { UserInfoJwt } from "./DbSections/LoadedDbUser/userAuthToken";

export type LoggedInReq<QN extends ApiQueryName> = LoggedIn<QueryReq<QN>>;
export type LoggedIn<T extends any> = T & LoggedInReqBase;
type LoggedInReqBase = {
  body: { userJwt: UserInfoJwt };
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

export function validateAuthObj(value: any): AuthData {
  const auth = Obj.validateObjToAny(value) as AuthData;
  return { id: Str.validate(auth.id) };
}
