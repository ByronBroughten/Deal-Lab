import { sectionsMeta, SectionsMeta } from "../SectionsMeta";
import { DbSectionInfo } from "../SectionsMeta/baseSectionsVarbs/DbSectionInfo";
import { getPath } from "../SectionsMeta/childPaths";
import {
  IdInfoMixedMulti,
  SectionInfoMixed,
  VarbInfoMixed,
} from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import { FeSectionInfo, FeVarbInfo } from "../SectionsMeta/Info";
import { isAbsoluteInfoType } from "../SectionsMeta/PathInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSectionsBase } from "./Bases/GetterSectionsBase";
import { GetterList } from "./GetterList";
import { GetterSection } from "./GetterSection";
import { GetterVarb } from "./GetterVarb";
import { GetterVarbs } from "./GetterVarbs";

export class GetterSections extends GetterSectionsBase {
  get meta(): SectionsMeta {
    return sectionsMeta;
  }
  list<SN extends SectionNameByType>(sectionName: SN): GetterList<SN> {
    return new GetterList({
      sectionName,
      sectionsShare: this.sectionsShare,
    });
  }
  oneAndOnly<SN extends SectionNameByType>(sectionName: SN): GetterSection<SN> {
    return this.list(sectionName).oneAndOnly;
  }
  get root(): GetterSection<"root"> {
    return this.list("root").oneAndOnly;
  }
  get main(): GetterSection<"main"> {
    return this.list("main").oneAndOnly;
  }
  get mainFeInfo() {
    return this.main.feInfo;
  }
  get feUser() {
    return this.list("feUser").oneAndOnly;
  }
  get mainFeInfoMixed() {
    return this.main.feInfoMixed;
  }
  newestEntry<SN extends SectionNameByType>(
    sectionName: SN
  ): GetterSection<SN> {
    return this.list(sectionName).last;
  }
  get one() {
    return this.section;
  }
  section<SN extends SectionNameByType>(
    info: FeSectionInfo<SN>
  ): GetterSection<SN> {
    return new GetterSection({
      ...info,
      sectionsShare: this.sectionsShare,
    });
  }
  sectionVarbs<SN extends SectionNameByType>(
    info: FeSectionInfo<SN>
  ): GetterVarbs<SN> {
    return new GetterVarbs({
      ...info,
      sectionsShare: this.sectionsShare,
    });
  }
  varbs<SN extends SectionName>(info: FeSectionInfo<SN>): GetterVarbs<SN> {
    return this.section(info).varbs;
  }
  varb<SN extends SectionNameByType>({
    varbName,
    ...info
  }: FeVarbInfo<SN>): GetterVarb<SN> {
    return this.section(info).varb(varbName);
  }
  sectionsByMixed<SN extends SectionName>(
    infoMixed: SectionInfoMixed<SN>
  ): GetterSection<SN>[] {
    if (infoMixed.infoType === "absolutePath") {
      const { sectionName, pathName } = infoMixed;
      return this.root.descendantsOfSn({
        sectionName,
        descendantNames: getPath(pathName),
      });
    } else if (infoMixed.infoType === "absolutePathDbId") {
      const { sectionName, pathName } = infoMixed;
      return this.root.descendantsByPathAndDbId({
        sectionName,
        descendantNames: getPath(pathName),
        dbId: infoMixed.id,
      });
    } else {
      return this.list(infoMixed.sectionName).getMultiByMixed(infoMixed);
    }
  }
  sectionByMixed<SN extends SectionName>(
    infoMixed: SectionInfoMixed<SN>
  ): GetterSection<SN> {
    if (infoMixed.infoType === "absolutePath") {
      const { sectionName, pathName } = infoMixed;
      return this.root.descendantOfSn({
        sectionName,
        descendantNames: getPath(pathName),
      });
    } else if (infoMixed.infoType === "absolutePathDbId") {
      const { sectionName, pathName } = infoMixed;
      return this.root.descendantByPathAndDbId({
        sectionName,
        descendantNames: getPath(pathName),
        dbId: infoMixed.id,
      });
    } else {
      return this.list(infoMixed.sectionName).getOneByMixed(
        infoMixed as IdInfoMixedMulti
      );
    }
  }
  sectionByDbInfo<SN extends SectionName>({
    sectionName,
    dbId,
  }: DbSectionInfo<SN>): GetterSection<SN> {
    return this.list(sectionName).getByDbId(dbId);
  }
  varbByMixed<SN extends SectionName>({
    varbName,
    ...info
  }: VarbInfoMixed<SN>): GetterVarb<SN> {
    if (isAbsoluteInfoType(info.infoType)) {
      const { root } = this;
      if (info.infoType === "absolutePath") {
        const { sectionName, pathName } = info;
        return root
          .descendantOfSn({
            sectionName,
            descendantNames: getPath(pathName),
          })
          .varb(varbName);
      }
    }
    return this.sectionByMixed(info).varb(varbName) as any;
  }
  numObjOrNotFoundByMixedAssertOne<SN extends SectionNameByType>(
    info: VarbInfoMixed<SN>
  ): string {
    if (this.hasSectionMixed(info)) {
      return this.varbByMixed(info).displayVarb();
    } else return "Not Found";
  }
  hasSection({ sectionName, feId }: FeSectionInfo): boolean {
    return this.list(sectionName).hasByFeId(feId);
  }
  hasSectionByDbInfo({ sectionName, dbId }: DbSectionInfo): boolean {
    return this.list(sectionName).hasByDbId(dbId);
  }
  hasSectionMixed(mixedInfo: SectionInfoMixed): boolean {
    if (mixedInfo.infoType === "absolutePath") {
      const { sectionName, pathName } = mixedInfo;
      return this.root.hasDescendantOfSn({
        sectionName,
        descendantNames: getPath(pathName),
      });
    } else if (mixedInfo.infoType === "absolutePathDbId") {
      const { sectionName, pathName } = mixedInfo;
      return this.root.hasDescendantByPathAndDbId({
        sectionName,
        descendantNames: getPath(pathName),
        dbId: mixedInfo.id,
      });
    } else {
      const { sectionName, ...idInfo } = mixedInfo;
      return this.list(sectionName).hasByMixed(idInfo);
    }
  }
  hasVarbMixed({ varbName, ...rest }: VarbInfoMixed): boolean {
    if (this.hasSectionMixed(rest)) {
      const section = this.sectionByMixed(rest);
      return section.meta.isVarbName(varbName);
    }
    return false;
  }
}
