import { Request, Response } from "express";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./apiQueriesShared/DbSections/DbUser";
import { sendSuccess } from "./apiQueriesShared/sendSuccess";
import { validateCreateDealReq } from "./apiQueriesShared/validateMisc";

export const getNewDealWare = [getAuthWare(), getNewDeal] as const;

async function getNewDeal(req: Request, res: Response) {
  const { auth, ...rest } = validateCreateDealReq(req).body;
  const dbUser = await DbUser.initBy("authId", auth.id);

  if (rest.loadFrom === "dataBase") {
    let sectionPack = await dbUser.getSectionPack({
      dbStoreName: "dealMain",
      dbId: rest.dbId,
    });
    sendSuccess(res, "getSection", { data: { sectionPack } });
  } else {
  }
}
