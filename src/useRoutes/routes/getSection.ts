import { Request, Response } from "express";
import { DbUserService } from "../../DbUserService";
import { getAuthWare } from "../../middleware/authWare";
import { sendSuccess } from "./routesShared/sendSuccess";
import { validateDbSectionInfoReq } from "./routesShared/validateCommonReqs";

export const getSectionWare = [getAuthWare(), getSectionServerSide] as const;

async function getSectionServerSide(req: Request, res: Response) {
  const { auth, ...dbInfo } = validateDbSectionInfoReq(req).body;

  const dbUser = await DbUserService.initBy("authId", auth.id);
  let sectionPack = await dbUser.getSectionPack(dbInfo);
  sectionPack = await dbUser.syncSectionPack(sectionPack);
  sendSuccess(res, "getSection", {
    data: { sectionPack },
  });
}
