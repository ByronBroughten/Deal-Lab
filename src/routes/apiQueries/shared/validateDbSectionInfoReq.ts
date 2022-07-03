import { Request, Response } from "express";
import { DbSectionPackInfoReq } from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { Id } from "../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsUtils/id";
import {
  DbSectionName,
  savableNameS,
  SavableSectionType,
} from "../../../client/src/App/sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/storeArrs";
import { ResHandledError } from "../../../resErrorUtils";
import { LoggedIn, validateLoggedInUser } from "./validateLoggedInUser";

export function validateDbSectionInfoReq(
  req: Request,
  res: Response
): LoggedIn<DbSectionPackInfoReq> {
  const { user, dbId, sectionName } = req.body;
  return {
    body: {
      dbId: validateDbId(dbId, res),
      sectionName: validateDbStoreName(sectionName, res),
      user: validateLoggedInUser(user, res),
    },
  };
}

function validateDbId(value: any, res: Response): string {
  if (Id.is(value)) return value;
  else {
    res.status(500).send("The received dbId is not valid.");
    throw new ResHandledError("Handled in validateRawSectionPack");
  }
}

export function validateDbStoreName<DT extends SavableSectionType = "all">(
  value: any,
  res: Response,
  type?: DT
): DbSectionName<DT> {
  if (savableNameS.is(value, type)) return value;
  else {
    res.status(500).send("The received dbId is not valid.");
    throw new ResHandledError("Handled in validateRawSectionPack");
  }
}
