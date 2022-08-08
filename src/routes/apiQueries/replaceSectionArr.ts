import { Request, Response } from "express";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./shared/DbSections/DbUser";
import { sendSuccess } from "./shared/sendSuccess";
import { validateSectionPackArrReq } from "./shared/validateSectionPackReq";

export const replaceSectionArrWare = [getAuthWare(), replaceSectionArr];

async function replaceSectionArr(req: Request, res: Response) {
  const { auth, dbStoreName, sectionPackArr } =
    validateSectionPackArrReq(req).body;

  const dbUser = await DbUser.initBy("authId", auth.id);
  await dbUser.setSectionPackArr({
    storeName: dbStoreName,
    sectionPackArr,
  });
  sendSuccess(res, "replaceSectionArr", {
    data: { dbStoreName },
  });
}
