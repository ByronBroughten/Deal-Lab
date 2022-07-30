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
import { SectionPack } from "../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { LoggedIn, UserAuthedReq } from "./UserAuthedReq";
import { validateDbStoreName } from "./validateDbSectionInfoReq";

type PackArrReq = LoggedIn<SectionPackArrReq<SectionArrQueryName>>;
export function validateSectionPackArrReq(req: UserAuthedReq<any>): PackArrReq {
  const { sectionPackArr, userJwt, dbStoreName } = (req as PackArrReq).body;
  return {
    body: {
      userJwt,
      dbStoreName: validateDbStoreName(dbStoreName, "arrQuery"),
      sectionPackArr: validateDbSectionPackArr({
        dbStoreName,
        value: sectionPackArr,
      }),
    },
  };
}

type PackReq = LoggedIn<SectionPackReq>;
export function validateSectionPackReq(req: UserAuthedReq<any>): PackReq {
  const { userJwt, sectionPack, dbStoreName } = (req as PackReq).body;
  return {
    body: {
      userJwt,
      dbStoreName: validateDbStoreName(dbStoreName, "sectionQuery"),
      sectionPack: validateDbSectionPack(sectionPack, dbStoreName),
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

function validateDbSectionPack<CN extends DbStoreName>(
  value: any,
  dbStoreName: CN
): SectionPack<DbSectionName<CN>> {
  if (isDbStoreSectionPack(value, dbStoreName)) return value;
  throw new Error("Payload is not a valid server sectionPack");
}
