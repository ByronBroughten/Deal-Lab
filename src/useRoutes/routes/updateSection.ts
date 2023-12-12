import { Request, Response } from "express";
import { DbUserService } from "../../DbUserService";
import { getAuthWare } from "../../middleware/authWare";
import { sendSuccess } from "./routesShared/sendSuccess";
import { validateSectionPackReq } from "./routesShared/validateCommonReqs";

export const updateSectionWare = [
  getAuthWare(),
  updateSectionSeverSide,
] as const;

async function updateSectionSeverSide(req: Request, res: Response) {
  const { dbStoreName, sectionPack, auth } = validateSectionPackReq(req).body;
  const dbUser = await DbUserService.initBy("authId", auth.id);
  await dbUser.updateSectionPack({ dbStoreName, sectionPack });
  sendSuccess(res, "updateSection", { data: { dbId: sectionPack.dbId } });
}
