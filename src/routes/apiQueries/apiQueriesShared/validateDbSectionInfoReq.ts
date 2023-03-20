import { DbPackInfoSectionReq } from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { Id } from "../../../client/src/App/sharedWithServer/SectionsMeta/IdS";
import {
  DbStoreNameByType,
  dbStoreNameS,
  DbStoreType,
} from "../../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbStoreName";
import { Authed, validateAuthObj } from "./ReqAugmenters";

type InfoReq = Authed<DbPackInfoSectionReq>;
export function validateDbSectionInfoReq(req: Authed<any>): InfoReq {
  const { dbId, dbStoreName, auth } = (req as InfoReq).body;
  return {
    body: {
      auth: validateAuthObj(auth),
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
    throw new Error(`The received dbStoreName "${value}" is not valid.`);
  }
}

function validateDbId(value: any): string {
  if (Id.is(value)) return value;
  else {
    throw new Error("The received dbId is not valid.");
  }
}
