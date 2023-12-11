import { Request, Response } from "express";
import { DbUser } from "../../database/DbUser";
import { getAuthWare } from "../../middleware/authWare";
import { sendSuccess } from "./routesShared/sendSuccess";
import { validateDbSectionInfoReq } from "./routesShared/validateCommonReqs";

export const deleteSectionWare = [
  getAuthWare(),
  deleteSectionServerSide,
] as const;

async function deleteSectionServerSide(req: Request, res: Response) {
  const { auth, ...spInfo } = validateDbSectionInfoReq(req).body;
  const dbUser = await DbUser.initBy("authId", auth.id);
  await dbUser.deleteSectionPack(spInfo);
  sendSuccess(res, "deleteSection", { data: { dbId: spInfo.dbId } });
}
