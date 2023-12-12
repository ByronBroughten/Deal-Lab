import { Request, Response } from "express";
import { DbUserService } from "../../DbUserService";
import { getAuthWare } from "../../middleware/authWare";
import { sendSuccess } from "./routesShared/sendSuccess";
import { validateSectionQueryArrReq } from "./routesShared/validateCommonReqs";

export const replaceSectionArrWare = [getAuthWare(), replaceSectionArrs];

async function replaceSectionArrs(req: Request, res: Response) {
  const { auth, sectionPackArrs } = validateSectionQueryArrReq(req).body;
  const dbUser = await DbUserService.initBy("authId", auth.id);
  await dbUser.setSectionPackArrs(sectionPackArrs);
  sendSuccess(res, "replaceSectionArrs", { data: {} });
}
