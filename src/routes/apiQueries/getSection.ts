import { Request, Response } from "express";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./apiQueriesShared/DbSections/DbUser";
import { sendSuccess } from "./apiQueriesShared/sendSuccess";
import { validateDbSectionInfoReq } from "./apiQueriesShared/validateDbSectionInfoReq";

export const getSectionWare = [getAuthWare(), getSectionServerSide] as const;

async function getSectionServerSide(req: Request, res: Response) {
  const { auth, ...dbInfo } = validateDbSectionInfoReq(req).body;

  const dbUser = await DbUser.initBy("authId", auth.id);
  let sectionPack = await dbUser.getSectionPack(dbInfo);
  sectionPack = await dbUser.syncSectionPackChildren(sectionPack);
  sendSuccess(res, "getSection", {
    data: { sectionPack },
  });
}
