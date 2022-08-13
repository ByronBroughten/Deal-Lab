import { Request, Response } from "express";
import {
  isMainStoreSectionName,
  sectionToMainStoreName,
} from "../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { SectionPack } from "../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { FeSectionInfo } from "../../client/src/App/sharedWithServer/SectionsMeta/Info";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { getAuthWare } from "../../middleware/authWare";
import { DbUser } from "./shared/DbSections/DbUser";
import { sendSuccess } from "./shared/sendSuccess";
import { validateDbSectionInfoReq } from "./shared/validateDbSectionInfoReq";

export const getSectionWare = [getAuthWare(), getSectionServerSide] as const;

async function getSectionServerSide(req: Request, res: Response) {
  const { auth, ...dbInfo } = validateDbSectionInfoReq(req).body;

  const dbUser = await DbUser.initBy("authId", auth.id);
  const sectionPackAsIs = await dbUser.getSectionPack(dbInfo);
  const headSection = PackBuilderSection.loadAsOmniChild(sectionPackAsIs);
  const { sections } = headSection;
  let sectionInfos: FeSectionInfo[] = [headSection.feInfo];
  while (sectionInfos.length > 0) {
    const nextInfos: FeSectionInfo[] = [];
    for (const info of sectionInfos) {
      const section = sections.section(info);
      for (const childName of section.get.childNames) {
        for (const child of section.children(childName)) {
          const { sectionName, dbId } = child.get;
          if (isMainStoreSectionName(sectionName)) {
            const dbStoreName = sectionToMainStoreName(sectionName);
            const childDbInfo = { dbStoreName, dbId };
            if (await dbUser.hasSectionPack(childDbInfo)) {
              const childPack = await dbUser.getSectionPack(childDbInfo);
              child.loadSelf(childPack as any as SectionPack<any>);
            }
          }
          nextInfos.push(child.feInfo);
        }
      }
    }
    sectionInfos = nextInfos;
  }
  sendSuccess(res, "getSection", {
    data: { sectionPack: headSection.makeSectionPack() },
  });
}
