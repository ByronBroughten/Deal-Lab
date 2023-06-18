import { Request, Response } from "express";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers/PackBuilderSection";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./apiQueriesShared/DbSections/DbUser";
import { sendSuccess } from "./apiQueriesShared/sendSuccess";
import { validateEmptyAuthReq } from "./apiQueriesShared/validateEmptyAuthReq";

export const getArchivedDealsWare = [getAuthWare(), getArchivedDeals] as const;

async function getArchivedDeals(req: Request, res: Response) {
  const { auth } = validateEmptyAuthReq(req).body;

  const dbUser = await DbUser.initBy("authId", auth.id);
  const dealPacks = await dbUser.getSectionPackArr("dealMain");
  const archivedPacks = dealPacks.filter((pack) => {
    const deal = PackBuilderSection.loadAsOmniChild(pack);
    return deal.get.valueNext("isArchived");
  });

  sendSuccess(res, "getArchivedDeals", {
    data: archivedPacks,
  });
}
