import { Request, Response } from "express";
import { SectionPack } from "../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers/PackBuilderSection";
import { DbUser } from "../../database/DbUser";
import { getAuthWare, validateEmptyAuthReq } from "../../middleware/authWare";
import { sendSuccess } from "./routesShared/sendSuccess";

export const getArchivedDealsWare = [getAuthWare(), getArchivedDeals] as const;

async function getArchivedDeals(req: Request, res: Response) {
  const { auth } = validateEmptyAuthReq(req).body;

  const dbUser = await DbUser.initBy("authId", auth.id);
  const dbPacks = await dbUser.getSectionPackArr("dealMain");
  const archivedPacks = dbPacks.reduce((packArr, pack) => {
    const deal = PackBuilderSection.hydratePackAsOmniChild(pack).get;
    if (deal.valueNext("isArchived")) {
      packArr.push(pack);
    }
    return packArr;
  }, [] as SectionPack<"deal">[]);
  sendSuccess(res, "getArchivedDeals", {
    data: archivedPacks,
  });
}
