import { Request, Response } from "express";
import { DbSectionPackInfoReq } from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeGeneralReqs";
import { Id } from "../../../client/src/App/sharedWithServer/SectionMetas/baseSections/id";
import {
  dbStoreNameS,
  SavableSectionName,
  SavableSectionType,
} from "../../../client/src/App/sharedWithServer/SectionMetas/relNameArrs/storeArrs";
import { ResHandledError } from "../../../middleware/error";
import { LoggedIn, validateLoggedInUser } from "./validateLoggedInUser";

export function validateDbSectionInfoReq(
  req: Request,
  res: Response
): LoggedIn<DbSectionPackInfoReq> {
  const { user, dbId, dbStoreName } = req.body;
  return {
    body: {
      dbId: validateDbId(dbId, res),
      dbStoreName: validateDbStoreName(dbStoreName, res),
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
): SavableSectionName<DT> {
  if (dbStoreNameS.is(value, type)) return value;
  else {
    res.status(500).send("The received dbId is not valid.");
    throw new ResHandledError("Handled in validateRawSectionPack");
  }
}
