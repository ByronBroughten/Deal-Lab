import {
  SectionPackArrsReq,
  SectionPackReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import {
  validateDbSectionPack,
  validateDbSectionPackArrs,
} from "../../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbSectionPack";
import {
  Authed,
  LoggedIn,
  LoggedInReq,
  validateAuthObj,
} from "./ReqAugmenters";
import { validateDbStoreName } from "./validateDbSectionInfoReq";

type PackArrReq = Authed<SectionPackArrsReq>;
export function validateSectionQueryArrReq(req: Authed<any>): PackArrReq {
  const { sectionPackArrs, auth } = (req as PackArrReq).body;
  return {
    body: {
      auth: validateAuthObj(auth),
      sectionPackArrs: validateDbSectionPackArrs(
        sectionPackArrs,
        "sectionQuery"
      ),
    },
  };
}

type PackReq = Authed<LoggedIn<SectionPackReq>>;
export function validateSectionPackReq(req: LoggedInReq<any>): PackReq {
  const { userJwt, sectionPack, dbStoreName, auth } = (req as PackReq).body;
  return {
    body: {
      userJwt, // this should already be validated by userJwtWare
      auth: validateAuthObj(auth),
      dbStoreName: validateDbStoreName(dbStoreName, "sectionQuery"),
      sectionPack: validateDbSectionPack(sectionPack, dbStoreName),
    },
  };
}
