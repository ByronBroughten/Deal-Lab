import { Request, Response } from "express";
import { DbUser } from "../../database/DbUser";
import { getAuthWare } from "../../middleware/authWare";
import { sendSuccess } from "./routesShared/sendSuccess";
import { validateSectionQueryArrReq } from "./routesShared/validateCommonReqs";

export const replaceSectionArrWare = [getAuthWare(), replaceSectionArrs];

async function replaceSectionArrs(req: Request, res: Response) {
  const { auth, sectionPackArrs } = validateSectionQueryArrReq(req).body;
  const dbUser = await DbUser.initBy("authId", auth.id);
  await dbUser.setSectionPackArrs(sectionPackArrs);
  sendSuccess(res, "replaceSectionArrs", { data: {} });
}
