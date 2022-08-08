import { Request, Response } from "express";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./shared/DbSections/DbUser";
import { sendSuccess } from "./shared/sendSuccess";
import { validateDbSectionInfoReq } from "./shared/validateDbSectionInfoReq";

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
