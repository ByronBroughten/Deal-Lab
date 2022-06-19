import { Request, Response } from "express";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import {
  SectionPackDbRaw,
  ServerSectionPack,
} from "../../client/src/App/sharedWithServer/SectionPack/SectionPackRaw";
import authWare from "../../middleware/authWare";
import { handleResAndMakeError } from "../../resErrorUtils";
import { SectionPackDb } from "../SectionPackDb";
import {
  findSectionPack,
  FindSectionPackProps,
} from "./shared/findSectionPack";
import { sendSuccess } from "./shared/sendSuccess";
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

async function getSectionPack(
  props: FindSectionPackProps
): Promise<ServerSectionPack> {
  const { res, spInfo } = props;
  const sectionPackDb = (await findSectionPack(props)) as SectionPackDbRaw;
  if (sectionPackDb)
    return SectionPackDb.rawDbToServer({
      sectionPackDb,
      dbStoreName: spInfo.dbStoreName,
    });
  else {
    throw handleResAndMakeError(res, 404, "Section not found.");
  }
}

function validateGetSectionReq(
  req: Request,
  res: Response
): LoggedIn<NextReq<"getSection">> {
  return validateDbSectionInfoReq(req, res);
}
