import { Request, Response } from "express";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./apiQueriesShared/DbSections/DbUser";
import { sendSuccess } from "./apiQueriesShared/sendSuccess";
import { validateSectionQueryArrReq } from "./apiQueriesShared/validateSectionPackReq";

export const replaceSectionArrWare = [getAuthWare(), replaceSectionArrs];

async function replaceSectionArrs(req: Request, res: Response) {
  const { auth, sectionPackArrs } = validateSectionQueryArrReq(req).body;
  const dbUser = await DbUser.initBy("authId", auth.id);
  await dbUser.setSectionPackArrs(sectionPackArrs);
  sendSuccess(res, "replaceSectionArrs", { data: {} });
}
