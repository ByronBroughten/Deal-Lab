import { Request, Response } from "express";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./apiQueriesShared/DbSections/DbUser";
import { sendSuccess } from "./apiQueriesShared/sendSuccess";
import { validateSectionPackArrReq } from "./apiQueriesShared/validateSectionPackReq";

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
