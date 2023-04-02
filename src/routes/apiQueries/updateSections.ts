import { Request, Response } from "express";
import { dbStoreNameS } from "../../client/src/App/sharedWithServer/SectionsMeta/sectionChildrenDerived/DbStoreName";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./apiQueriesShared/DbSections/DbUser";
import { sendSuccess } from "./apiQueriesShared/sendSuccess";
import { validateSectionQueryArrReq } from "./apiQueriesShared/validateSectionPackReq";

export const updateSectionsWare = [getAuthWare(), updateSections] as const;

export async function updateSections(req: Request, res: Response) {
  const { sectionPackArrs, auth } = validateSectionQueryArrReq(req).body;
  const dbUser = await DbUser.initBy("authId", auth.id);
  for (const dbStoreName of dbStoreNameS.arrs.sectionQuery) {
    const packs = sectionPackArrs[dbStoreName];
    if (packs) {
      for (const sectionPack of packs) {
        await dbUser.updateSectionPack({
          dbStoreName,
          sectionPack,
        });
      }
    } else {
      throw new Error(`dbStoreNme "${dbStoreName}" is missing from the req`);
    }
  }
  sendSuccess(res, "updateSections", { data: { success: true } });
}
