import { Request, Response } from "express";
import { userAuthWare } from "../../middleware/authWare";
import { DbSectionsQuerier } from "./shared/DbSections/DbSectionsQuerier";
import { sendSuccess } from "./shared/sendSuccess";
import { validateSectionPackArrReq } from "./shared/validateSectionPackReq";

export const replaceSectionArrWare = [
  userAuthWare,
  replaceSectionArrServerSide,
];

async function replaceSectionArrServerSide(req: Request, res: Response) {
  const {
    userJwt: { userId },
    dbStoreName,
    sectionPackArr,
  } = validateSectionPackArrReq(req).body;

  const querier = await DbSectionsQuerier.init(userId, "userId");
  await querier.setSectionPackArr({
    storeName: dbStoreName,
    sectionPackArr,
  });
  sendSuccess(res, "replaceSectionArr", {
    data: { dbStoreName },
  });
}
