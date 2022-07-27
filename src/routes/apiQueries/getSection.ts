import { Request, Response } from "express";
import { sectionsMeta } from "../../client/src/App/sharedWithServer/SectionsMeta";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { userAuthWare } from "../../middleware/authWare";
import { DbSectionsQuerier } from "./shared/DbSections/DbSectionsQuerier";
import { sendSuccess } from "./shared/sendSuccess";
import { validateDbSectionInfoReq } from "./shared/validateDbSectionInfoReq";

export const getSectionWare = [userAuthWare, getSectionServerSide] as const;

async function getSectionServerSide(req: Request, res: Response) {
  const {
    userJwt: { userId },
    ...dbInfo
  } = validateDbSectionInfoReq(req).body;

  const querier = await DbSectionsQuerier.init(userId, "userId");
  const sectionPack = await querier.getSectionPack(dbInfo);
  const section = PackBuilderSection.loadAsOmniChild(sectionPack);
  const dbStoreMeta = sectionsMeta.section("dbStore");
  const { childNames } = section.get;
  for (const childName of childNames) {
    const children = section.get.children(childName);
    for (const child of children) {
      const { sectionName, dbId } = child;
      // the querier can have something like, "hasMainSection"
      // and the produce the mainSection based on the sectionName
    }
  }

  // if one of the section's children

  sendSuccess(res, "getSection", { data: { sectionPack } });
}
