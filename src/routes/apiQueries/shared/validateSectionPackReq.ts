import {
  SectionPackArrReq,
  SectionPackReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import {
  isSectionPack,
  SectionPack,
} from "../../../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { sectionsMeta } from "../../../client/src/App/sharedWithServer/SectionsMeta";
import {
  DbSectionName,
  DbStoreName,
} from "../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/dbStoreNames";
import { LoggedIn, UserAuthedReq } from "./UserAuthedReq";
import { validateDbStoreName } from "./validateDbSectionInfoReq";

type PackArrReq = LoggedIn<SectionPackArrReq<DbStoreName>>;
export function validateSectionPackArrReq(req: UserAuthedReq<any>): PackArrReq {
  const { sectionPackArr, userJwt, dbStoreName } = (req as PackArrReq).body;
  return {
    body: {
      userJwt,
      dbStoreName: validateDbStoreName(dbStoreName),
      sectionPackArr: validateServerSectionPackArr({
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
      dbStoreName: validateDbStoreName(dbStoreName),
      sectionPack: validateServerSectionPack(sectionPack, dbStoreName),
    },
  };
}

type ValidateServerSectionPackArrProps<CN extends DbStoreName> = {
  value: any;
  dbStoreName: CN;
};
function validateServerSectionPackArr<CN extends DbStoreName>({
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

function validateServerSectionPack<CN extends DbStoreName>(
  value: any,
  dbStoreName: CN
): SectionPack<DbSectionName<CN>> {
  if (isDbStoreSectionPack(value, dbStoreName)) return value;
  throw new Error("Payload is not a valid server sectionPack");
}

function isDbStoreSectionPack<CN extends DbStoreName>(
  value: any,
  dbStoreName: CN
): value is SectionPack<DbSectionName<CN>> {
  return (
    isSectionPack(value) &&
    value.sectionName === sectionsMeta.section("dbStore").childType(dbStoreName)
  );
}
