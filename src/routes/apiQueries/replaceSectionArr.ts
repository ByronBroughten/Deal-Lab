import { Request, Response } from "express";
import { checkLoginWare } from "../../middleware/authWare";
import { DbUser } from "./shared/DbSections/DbUser";
import { sendSuccess } from "./shared/sendSuccess";
import { validateSectionPackArrReq } from "./shared/validateSectionPackReq";

export const replaceSectionArrWare = [
  checkLoginWare,
  replaceSectionArrServerSide,
];

async function replaceSectionArrServerSide(req: Request, res: Response) {
  const {
    userJwt: { userId },
    dbStoreName,
    sectionPackArr,
  } = validateSectionPackArrReq(req).body;

  const querier = await DbUser.initBy("userId", userId);
  await querier.setSectionPackArr({
    storeName: dbStoreName,
    sectionPackArr,
  });
  sendSuccess(res, "replaceSectionArr", {
    data: { dbStoreName },
  });
}
