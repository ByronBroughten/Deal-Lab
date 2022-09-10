import {
  SectionPackArrReq,
  SectionPackReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { isDbStoreSectionPack } from "../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbSectionPack";
import {
  DbSectionName,
  DbStoreName,
  SectionArrQueryName,
} from "../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import {
  SectionPack,
  validateSectionPack,
} from "../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import {
  Authed,
  LoggedIn,
  LoggedInReq,
  validateAuthObj,
} from "./ReqAugmenters";
import { validateDbStoreName } from "./validateDbSectionInfoReq";

type PackArrReq = Authed<SectionPackArrReq<SectionArrQueryName>>;
export function validateSectionPackArrReq(req: Authed<any>): PackArrReq {
  const { sectionPackArr, auth, dbStoreName } = (req as PackArrReq).body;
  return {
    body: {
      auth: validateAuthObj(auth),
      dbStoreName: validateDbStoreName(dbStoreName, "arrQuery"),
      sectionPackArr: validateDbSectionPackArr({
        dbStoreName,
        value: sectionPackArr,
      }),
    },
  };
}

type ValidateServerSectionPackArrProps<CN extends DbStoreName> = {
  value: any;
  dbStoreName: CN;
};
function validateDbSectionPackArr<CN extends DbStoreName>({
  value,
  dbStoreName,
}: ValidateServerSectionPackArrProps<CN>): SectionPack<DbSectionName<CN>>[] {
  if (
    Array.isArray(value) &&
    value.every((v) => isDbStoreSectionPack(v, dbStoreName))
  ) {
    return value;
  } else {
    throw new Error("Payload is not a valid server section array.");
  }
}

type PackReq = Authed<LoggedIn<SectionPackReq>>;
export function validateSectionPackReq(req: LoggedInReq<any>): PackReq {
  const { userJwt, sectionPack, dbStoreName, auth } = (req as PackReq).body;
  return {
    body: {
      userJwt,
      auth: validateAuthObj(auth),
      dbStoreName: validateDbStoreName(dbStoreName, "sectionQuery"),
      sectionPack: validateDbSectionPack(sectionPack, dbStoreName),
    },
  };
}

function validateDbSectionPack<CN extends DbStoreName>(
  value: any,
  dbStoreName: CN
): SectionPack<DbSectionName<CN>> {
  validateSectionPack(value);
  if (isDbStoreSectionPack(value, dbStoreName)) return value;
  throw new Error(
    `value is not a valid sectionPack from dbStore "${dbStoreName}"`
  );
}
