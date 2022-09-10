import { Request, Response } from "express";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./apiQueriesShared/DbSections/DbUser";
import { sendSuccess } from "./apiQueriesShared/sendSuccess";
import { validateDbSectionInfoReq } from "./apiQueriesShared/validateDbSectionInfoReq";

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
