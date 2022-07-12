import { Request } from "express";
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
import { LoggedIn, validateLoggedInUser } from "./LoggedInUser";
import { validateDbStoreName } from "./validateDbSectionInfoReq";

export function validateSectionPackArrReq(
  req: Request
): LoggedIn<SectionPackArrReq<DbStoreName>> {
  const { sectionPackArr, user, dbStoreName } = req.body;
  return {
    body: {
      user: validateLoggedInUser(user),
      dbStoreName: validateDbStoreName(dbStoreName),
      sectionPackArr: validateServerSectionPackArr({
        dbStoreName,
        value: sectionPackArr,
      }),
    },
  };
}

export function validateSectionPackReq(req: Request): LoggedIn<SectionPackReq> {
  const { user, sectionPack, dbStoreName } = req.body;
  return {
    body: {
      user: validateLoggedInUser(user),
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
