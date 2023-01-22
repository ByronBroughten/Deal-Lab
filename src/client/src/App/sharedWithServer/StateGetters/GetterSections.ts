import { sectionsMeta, SectionsMeta } from "../SectionsMeta";
import { DbSectionInfo } from "../SectionsMeta/allBaseSectionVarbs/DbSectionInfo";
import {
  IdInfoMixedMulti,
  SectionInfoMixed,
  VarbInfoMixed,
} from "../SectionsMeta/sectionChildrenDerived/MixedSectionInfo";
import { FeSectionInfo, FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import {
  GetterSectionsBase,
  GetterSectionsRequiredProps,
} from "./Bases/GetterSectionsBase";
import { GetterList } from "./GetterList";
import { GetterSection } from "./GetterSection";
import { GetterVarb } from "./GetterVarb";

export class GetterSections extends GetterSectionsBase {
  static init(requiredProps: GetterSectionsRequiredProps) {
    return new GetterSections(GetterSectionsBase.initProps(requiredProps));
  }
  get meta(): SectionsMeta {
    return sectionsMeta;
  }
  list<SN extends SectionNameByType>(sectionName: SN): GetterList<SN> {
    return new GetterList({
      sectionName,
      ...this.getterSectionsProps,
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
      ...this.getterSectionsProps,
    });
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
      const { sectionName, path } = infoMixed;
      return this.root.descendantsOfSn({
        sectionName,
        descendantNames: path,
      });
    } else if (infoMixed.infoType === "absolutePathDbId") {
      const { sectionName, path } = infoMixed;
      return this.root.descendantsByPathAndDbId({
        sectionName,
        descendantNames: path,
        dbId: infoMixed.id,
      });
    } else {
      return this.list(infoMixed.sectionName).getMultiByMixed(infoMixed);
    }
  }
  sectionByMixed<SN extends SectionName>(
    infoMixed: SectionInfoMixed<SN>
  ): GetterSection<SN> {
    switch (infoMixed.infoType) {
      case "absolutePath":
      case "absolutePathDbId": {
        const { sectionName, path: descendantNames } = infoMixed;
        if (infoMixed.infoType === "absolutePath") {
          return this.root.descendantOfSn({
            sectionName,
            descendantNames,
          });
        } else if (infoMixed.infoType === "absolutePathDbId") {
          return this.root.descendantByPathAndDbId({
            sectionName,
            descendantNames,
            dbId: infoMixed.id,
          });
        }
      }
      default: {
        return this.list(infoMixed.sectionName).getOneByMixed(
          infoMixed as IdInfoMixedMulti
        );
      }
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
    return this.sectionByMixed(info).varb(varbName) as any;
  }
  hasSection({ sectionName, feId }: FeSectionInfo): boolean {
    return this.list(sectionName).hasByFeId(feId);
  }
  hasSectionByDbInfo({ sectionName, dbId }: DbSectionInfo): boolean {
    return this.list(sectionName).hasByDbId(dbId);
  }
  hasSectionMixed(mixedInfo: SectionInfoMixed): boolean {
    switch (mixedInfo.infoType) {
      case "absolutePath":
      case "absolutePathDbId": {
        const { sectionName, path: descendantNames } = mixedInfo;
        if (mixedInfo.infoType === "absolutePath") {
          return this.root.hasDescendantOfSn({
            sectionName,
            descendantNames,
          });
        } else if (mixedInfo.infoType === "absolutePathDbId") {
          return this.root.hasDescendantByPathAndDbId({
            sectionName,
            descendantNames,
            dbId: mixedInfo.id,
          });
        }
      }
      default: {
        return this.list(mixedInfo.sectionName).hasByMixed(
          mixedInfo as IdInfoMixedMulti
        );
      }
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
