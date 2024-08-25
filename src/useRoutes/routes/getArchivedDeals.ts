import { Request, Response } from "express";
import { SectionPack } from "../../client/src/sharedWithServer/SectionPacks/SectionPack";
import { PackBuilderSection } from "../../client/src/sharedWithServer/StateOperators/Packers/PackBuilderSection";
import { DbUserService } from "../../DbUserService";
import { getAuthWare, validateEmptyAuthReq } from "../../middleware/authWare";
import { sendSuccess } from "./routesShared/sendSuccess";

export const getArchivedDealsWare = [getAuthWare(), getArchivedDeals] as const;

async function getArchivedDeals(req: Request, res: Response) {
  const { auth } = validateEmptyAuthReq(req).body;

  const dbUser = await DbUserService.initBy("authId", auth.id);
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
