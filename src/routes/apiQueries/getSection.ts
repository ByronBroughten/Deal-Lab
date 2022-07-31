import { Request, Response } from "express";
import {
  isMainStoreSectionName,
  sectionToMainStoreName,
} from "../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { SectionPack } from "../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { FeSectionInfo } from "../../client/src/App/sharedWithServer/SectionsMeta/Info";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { userAuthWare } from "../../middleware/authWare";
import { QueryUser } from "./shared/DbSections/QueryUser";
import { sendSuccess } from "./shared/sendSuccess";
import { validateDbSectionInfoReq } from "./shared/validateDbSectionInfoReq";

export const getSectionWare = [userAuthWare, getSectionServerSide] as const;

async function getSectionServerSide(req: Request, res: Response) {
  const {
    userJwt: { userId },
    ...dbInfo
  } = validateDbSectionInfoReq(req).body;

  const querier = await QueryUser.init(userId, "userId");
  const sectionPack = await querier.getSectionPack(dbInfo);
  const headSection = PackBuilderSection.loadAsOmniChild(sectionPack);
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
            if (await querier.hasSectionPack(childDbInfo)) {
              const childPack = await querier.getSectionPack(childDbInfo);
              child.loadSelf(childPack as any as SectionPack<any>);
            }
          }
          nextInfos.push(child.feInfo);
        }
      }
    }
    sectionInfos = nextInfos;
  }
  sendSuccess(res, "getSection", { data: { sectionPack } });
}
