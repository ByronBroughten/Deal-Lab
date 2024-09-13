import {
  DbPackInfoSectionReq,
  SectionPackArrsReq,
  SectionPackReq,
} from "../../../client/src/sharedWithServer/apiQueriesShared/makeReqAndRes";
import {
  DbStoreNameByType,
  dbStoreNameS,
  DbStoreType,
} from "../../../client/src/sharedWithServer/stateSchemas/fromSchema6SectionChildren/DbStoreName";
import {
  validateDbSectionPack,
  validateDbSectionPackArrs,
} from "../../../client/src/sharedWithServer/StateTransports/DbSectionPack";
import { IdS } from "../../../client/src/sharedWithServer/utils/IdS";
import { Authed, validateAuthData } from "../middleware/authWare";
import { JwtReq, WithJWT } from "../middleware/jwtWare";

type InfoReq = Authed<DbPackInfoSectionReq>;
export function validateDbSectionInfoReq(req: Authed<any>): InfoReq {
  const { dbId, dbStoreName, auth } = (req as InfoReq).body;
  return {
    body: {
      auth: validateAuthData(auth),
      dbId: validateDbId(dbId),
      dbStoreName: validateDbStoreName(dbStoreName, "sectionQuery"),
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

export function validateDbId(value: any): string {
  if (IdS.is(value)) return value;
  else {
    throw new Error("The received dbId is not valid.");
  }
}

type PackArrReq = Authed<SectionPackArrsReq>;
export function validateSectionQueryArrReq(req: Authed<any>): PackArrReq {
  const { sectionPackArrs, auth } = (req as PackArrReq).body;
  return {
    body: {
      auth: validateAuthData(auth),
      sectionPackArrs: validateDbSectionPackArrs(
        sectionPackArrs,
        "sectionQuery"
      ),
    },
  };
}

type PackReq = Authed<WithJWT<SectionPackReq>>;
export function validateSectionPackReq(req: JwtReq<any>): PackReq {
  const { userJwt, sectionPack, dbStoreName, auth } = (req as PackReq).body;
  return {
    body: {
      userJwt, // this should already be validated by userJwtWare
      auth: validateAuthData(auth),
      dbStoreName: validateDbStoreName(dbStoreName, "sectionQuery"),
      sectionPack: validateDbSectionPack(sectionPack, dbStoreName),
    },
  };
}
