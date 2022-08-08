import { Request, Response } from "express";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./shared/DbSections/DbUser";
import { sendSuccess } from "./shared/sendSuccess";
import { validateSectionPackReq } from "./shared/validateSectionPackReq";

export const updateSectionWare = [
  getAuthWare(),
  updateSectionSeverSide,
] as const;

async function updateSectionSeverSide(req: Request, res: Response) {
  const { dbStoreName, sectionPack, auth } = validateSectionPackReq(req).body;
  const dbUser = await DbUser.initBy("authId", auth.id);
  await dbUser.updateSectionPack({ dbStoreName, sectionPack });
  sendSuccess(res, "updateSection", { data: { dbId: sectionPack.dbId } });
}
