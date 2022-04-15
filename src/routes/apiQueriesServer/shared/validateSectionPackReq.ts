import { Request, Response } from "express";
import { SectionPack } from "../../../client/src/App/sharedWithServer/Analyzer/SectionPack";
import { ServerSectionPack } from "../../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import { SectionPackReq } from "../../../client/src/App/sharedWithServer/apiQueriesShared/shared";
import { ResHandledError } from "../../../middleware/error";
import { LoggedIn, validateLoggedInUser } from "./validateLoggedInUser";

export function validateSectionPackReq(
  req: Request,
  res: Response
): LoggedIn<SectionPackReq> {
  const { user, payload } = req.body;
  return {
    body: {
      user: validateLoggedInUser(user, res),
      payload: validateServerSectionPack(payload, res),
    },
  };
}

function validateServerSectionPack(
  value: any,
  res: Response
): ServerSectionPack {
  if (SectionPack.isRaw(value, { contextName: "db", sectionType: "dbStore" }))
    return value;
  else {
    res.status(500).send("The payload is not a valid server section pack.");
    throw new ResHandledError("Handled in validateRawSectionPack");
  }
}
