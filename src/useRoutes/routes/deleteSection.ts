import { Request, Response } from "express";
import { DbUserService } from "../../DbUserService";
import { getAuthWare } from "../../middleware/authWare";
import { sendSuccess } from "./routesShared/sendSuccess";
import { validateDbSectionInfoReq } from "./routesShared/validateCommonReqs";

export const deleteSectionWare = [
  getAuthWare(),
  deleteSectionServerSide,
] as const;

async function deleteSectionServerSide(req: Request, res: Response) {
  const { auth, ...spInfo } = validateDbSectionInfoReq(req).body;
  const dbUser = await DbUserService.initBy("authId", auth.id);
  await dbUser.deleteSectionPack(spInfo);
  sendSuccess(res, "deleteSection", { data: { dbId: spInfo.dbId } });
}
