import { Request, Response } from "express";
import {
  SectionPackDbRaw,
  ServerSectionPack,
} from "../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import authWare from "../../middleware/authWare";
import { ResHandledError } from "../../middleware/error";
import { sendSuccess } from "../shared/crudValidators";
import { SectionPackDb } from "../shared/UserDbNext/SectionPackDb";
import {
  findSectionPack,
  FindSectionPackProps,
} from "./shared/findSectionPack";
import { validateDbSectionInfoReq } from "./shared/validateDbSectionInfoReq";
import { LoggedIn } from "./shared/validateLoggedInUser";

export const getSectionWare = [authWare, getSectionServerSide] as const;

async function getSectionServerSide(req: Request, res: Response) {
  const {
    user: { _id: userId },
    ...spInfo
  } = validateGetSectionReq(req, res).body;

  const rawServerSectionPack = await getSectionPack({ userId, spInfo, res });
  sendSuccess(res, "getSection", { data: { rawServerSectionPack } });
}

export async function getSectionPack(
  props: FindSectionPackProps
): Promise<ServerSectionPack> {
  const sectionPackDb = (await findSectionPack(props)) as SectionPackDbRaw;
  const { res, spInfo } = props;
  if (sectionPackDb)
    return SectionPackDb.rawDbToServer({
      sectionPackDb,
      dbStoreName: spInfo.dbStoreName,
    });
  else {
    res.status(404).send("Section not found.");
    throw new ResHandledError("Handled in getSectionPack");
  }
}

function validateGetSectionReq(
  req: Request,
  res: Response
): LoggedIn<NextReq<"getSection">> {
  return validateDbSectionInfoReq(req, res);
}
