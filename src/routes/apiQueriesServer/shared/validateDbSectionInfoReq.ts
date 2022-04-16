import { Request, Response } from "express";
import { Id } from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/id";
import {
  SectionNam,
  SectionName,
} from "../../../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { DbSectionPackInfoReq } from "../../../client/src/App/sharedWithServer/apiQueriesShared/shared";
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

export function validateDbStoreName(
  value: any,
  res: Response
): SectionName<"dbStore"> {
  if (SectionNam.is(value, "dbStore")) return value;
  else {
    res.status(500).send("The received dbId is not valid.");
    throw new ResHandledError("Handled in validateRawSectionPack");
  }
}
