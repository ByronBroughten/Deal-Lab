import { DbPackInfoReq } from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { Id } from "../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsUtils/id";
import {
  DbStoreNameByType,
  dbStoreNameS,
  DbStoreType,
} from "../../../client/src/App/sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/dbStoreNameArrs";
import { LoggedIn, UserAuthedReq } from "./UserAuthedReq";

export function validateDbSectionInfoReq(
  req: UserAuthedReq<any>
): LoggedIn<DbPackInfoReq> {
  const { userJwt, dbId, dbStoreName } = (req as LoggedIn<DbPackInfoReq>).body;
  return {
    body: {
      userJwt: userJwt,
      dbId: validateDbId(dbId),
      dbStoreName: validateDbStoreName(dbStoreName),
    },
  };
}

function validateDbId(value: any): string {
  if (Id.is(value)) return value;
  else {
    throw new Error("The received dbId is not valid.");
  }
}

export function validateDbStoreName<DT extends DbStoreType = "all">(
  value: any,
  type?: DT
): DbStoreNameByType<DT> {
  if (dbStoreNameS.is(value, type)) return value;
  else {
    throw new Error("The received dbStoreName is not valid.");
  }
}
