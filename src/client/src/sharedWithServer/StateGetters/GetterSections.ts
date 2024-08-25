import { SectionId } from "../Ids/SectionId";
import {
  FeSectionInfo,
  FeVarbInfo,
  varbIdToInfo,
} from "../SectionInfos/FeInfo";
import {
  IdInfoMixedMulti,
  SectionInfoMixed,
  VarbInfoMixed,
} from "../SectionInfos/MixedSectionInfo";
import { SectionNameByType } from "../SectionNameByType";
import { SectionsMeta, sectionsMeta } from "../StateMeta/SectionsMeta";
import { DbSectionInfo } from "../stateSchemas/allBaseSectionVarbs/DbSectionInfo";
import { SectionName } from "../stateSchemas/SectionName";
import { Arr } from "../utils/Arr";
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
  list<SN extends SectionName>(sectionName: SN): GetterList<SN> {
    return new GetterList({
      sectionName,
      ...this.getterSectionsProps,
    });
  }
  onlyFeInfo<SN extends SectionName>(sectionName: SN): FeSectionInfo<SN> {
    return this.oneAndOnly(sectionName).feInfo;
  }
  oneAndOnly<SN extends SectionName>(sectionName: SN): GetterSection<SN> {
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
  get feStore() {
    return this.list("feStore").oneAndOnly;
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
  sectionBySectionId(sectionId: string) {
    const feInfo = SectionId.split(sectionId);
    return this.section(feInfo);
  }

  varb<SN extends SectionName>({
    varbName,
    ...info
  }: FeVarbInfo<SN>): GetterVarb<SN> {
    return this.section(info).varb(varbName);
  }
  varbById(varbId: string): GetterVarb {
    const { varbName, ...feInfo } = varbIdToInfo(varbId);
    return this.section(feInfo).varb(varbName);
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
    } else if (infoMixed.infoType === "absolutePathNode") {
      const { sectionName, pathNodes } = infoMixed;
      return this.root.descendantsOfSnByNode({
        sectionName,
        descendantNodes: pathNodes,
      });
    } else if (infoMixed.infoType === "absolutePathNodeDbId") {
      const { sectionName, pathNodes, dbId } = infoMixed;
      const sections = this.root.descendantsOfSnByNode({
        sectionName,
        descendantNodes: pathNodes,
      });
      return sections.filter((section) => section.dbId === dbId);
    } else if (infoMixed.infoType === "absolutePathDbId") {
      const { sectionName, path } = infoMixed;
      return this.root.descendantsByPathAndDbId({
        sectionName,
        descendantNames: path,
        dbId: infoMixed.id,
      });
    } else {
      return this.list(infoMixed.sectionName).allSectionsByMixed(infoMixed);
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
        } else {
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
  getActiveDeal(): GetterSection<"deal"> {
    const deals = this.getActiveDeals();
    return Arr.getOnlyOne(deals, "activeDeals");
  }
  isActiveDeal(feId: string): boolean {
    if (this.hasActiveDeal()) {
      const activeDeal = this.getActiveDeal();
      return activeDeal.feId === feId;
    } else {
      return false;
    }
  }
  isActiveDealByDbId(dbId: string): boolean {
    if (this.hasActiveDeal()) {
      const activeDeal = this.getActiveDeal();
      return activeDeal.dbId === dbId;
    } else {
      return false;
    }
  }
  hasActiveDeal(): boolean {
    const deals = this.getActiveDeals();
    if (deals.length === 1) {
      return true;
    } else if (deals.length === 0) {
      return false;
    } else {
      throw new Error(
        "There should only be one active deal at a time, but there are more"
      );
    }
  }
  getActiveDeals(): GetterSection<"deal">[] {
    const feStore = this.oneAndOnly("feStore");
    const deals = feStore.children("dealMain");
    return deals.filter((deal) => {
      const { sectionContextName } = deal;
      if (sectionContextName === "activeDealSystem") {
        return true;
      } else return false;
    });
  }
}
