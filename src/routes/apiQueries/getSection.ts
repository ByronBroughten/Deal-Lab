import { Request, Response } from "express";
import { NextReq } from "../../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import authWare from "../../middleware/authWare";
import { findSectionPack } from "./shared/findSectionPack";
import { sendSuccess } from "./shared/sendSuccess";
import { validateDbSectionInfoReq } from "./shared/validateDbSectionInfoReq";
import { LoggedIn } from "./shared/validateLoggedInUser";

export const getSectionWare = [authWare, getSectionServerSide] as const;

async function getSectionServerSide(req: Request, res: Response) {
  const {
    user: { _id: userId },
    ...spInfo
  } = validateGetSectionReq(req, res).body;

  const rawServerSectionPack = await findSectionPack({
    userId,
    ...spInfo,
    res,
  });
  sendSuccess(res, "getSection", { data: { rawServerSectionPack } });
}

function validateGetSectionReq(
  req: Request,
  res: Response
): LoggedIn<NextReq<"getSection">> {
  return validateDbSectionInfoReq(req, res);
}
