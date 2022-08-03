import { DbPackInfoSectionReq } from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { Id } from "../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsUtils/id";
import {
  DbStoreNameByType,
  dbStoreNameS,
  DbStoreType,
} from "../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { LoggedIn, LoggedInReq } from "./ReqAugmenters";

export function validateDbSectionInfoReq(
  req: LoggedInReq<any>
): LoggedIn<DbPackInfoSectionReq> {
  const { userJwt, dbId, dbStoreName } = (req as LoggedIn<DbPackInfoSectionReq>)
    .body;
  return {
    body: {
      userJwt: userJwt,
      dbId: validateDbId(dbId),
      dbStoreName: validateDbStoreName(dbStoreName, "allQuery"),
    },
  };
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

function validateDbId(value: any): string {
  if (Id.is(value)) return value;
  else {
    throw new Error("The received dbId is not valid.");
  }
}
