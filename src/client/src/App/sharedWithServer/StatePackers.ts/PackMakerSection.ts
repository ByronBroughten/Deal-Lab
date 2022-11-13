import {
  ChildIdArrsWide,
  ChildName,
  FeChildInfo,
} from "../SectionsMeta/childSectionsDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/childSectionsDerived/ChildSectionName";
import { ChildSectionPack } from "../SectionsMeta/childSectionsDerived/ChildSectionPack";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import {
  ChildSpNums,
  OneRawSection,
  RawSections,
} from "../SectionsMeta/childSectionsDerived/SectionPack/RawSection";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { StateSections } from "../StateSections/StateSections";
import { Obj } from "../utils/Obj";

export type FeSectionPackArrs<
  SN extends SectionName,
  CN extends ChildName<SN>
> = {
  [C in CN]: ChildSectionPack<SN, C>[];
};

type MakeFromSectionsProps<SN extends SectionName> = {
  sections: StateSections;
  sectionName: SN;
};
export class PackMakerSection<
  SN extends SectionNameByType
> extends GetterSectionBase<SN> {
  private sectionCount: number;
  private feIdToNum: Record<string, number>;
  constructor(props: GetterSectionProps<SN>) {
    super(props);
    this.sectionCount = 0;
    this.feIdToNum = {};
  }
  private reset() {
    this.sectionCount = 0;
    this.feIdToNum = {};
  }
  private addSpNum(feId: string): void {
    this.feIdToNum[feId] = this.sectionCount;
    this.sectionCount += 1;
  }
  private getSpNum(feId: string): number {
    const ids = Obj.keys(this.feIdToNum);
    if (!ids.includes(feId)) {
      this.addSpNum(feId);
    }
    return this.feIdToNum[feId];
  }
  get get(): GetterSection<SN> {
    return new GetterSection(this.getterSectionProps);
  }
  static makeFromSections<SN extends SectionName>({
    sections,
    sectionName,
  }: MakeFromSectionsProps<SN>): PackMakerSection<SN> {
    return new PackMakerSection({
      sectionsShare: { sections },
      ...sections.onlyOneRawSection(sectionName),
    });
  }
  makeSectionPack(): SectionPack<SN> {
    this.addSpNum(this.get.feId);
    const sectionPack = {
      dbId: this.get.dbId,
      sectionName: this.sectionName,
      rawSections: this.rawDescendantSections(),
    };
    this.reset();
    return sectionPack;
  }
  makeChildPackArrs<CN extends ChildName<SN>>(
    childNames: CN[]
  ): FeSectionPackArrs<SN, CN> {
    return childNames.reduce((spArrs, childName) => {
      (spArrs[childName] as any) = this.makeChildSectionPackArr(childName);
      return spArrs;
    }, {} as FeSectionPackArrs<SN, CN>);
  }
  makeChildSectionPackArr<CN extends ChildName<SN>>(
    childName: CN
  ): SectionPack<ChildSectionName<SN, CN>>[] {
    const feIds = this.get.childFeIds(childName);
    return feIds.map((feId) =>
      this.makeChildSectionPack({
        childName,
        feId,
      })
    );
  }
  makeSiblingSectionPackArr(): SectionPack<SN>[] {
    const { siblingFeInfos } = this.get;
    return siblingFeInfos.map((feInfo) => {
      const siblingMaker = this.sectionPackMaker(feInfo);
      return siblingMaker.makeSectionPack();
    });
  }
  sectionPackMaker<S extends SectionNameByType>(
    feInfo: FeSectionInfo<S>
  ): PackMakerSection<S> {
    return new PackMakerSection({
      ...feInfo,
      sectionsShare: this.sectionsShare,
    });
  }
  makeChildSectionPack<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): SectionPack<ChildSectionName<SN, CN>> {
    const feInfo = this.get.childToFeInfo(childInfo);
    const childPackMaker = this.sectionPackMaker(feInfo);
    return childPackMaker.makeSectionPack();
  }
  makeOnlyChildSectionPack<CN extends ChildName<SN>>(
    childName: CN
  ): ChildSectionPack<SN, CN> {
    const { feInfo } = this.get.onlyChild(childName);
    const childPackMaker = this.sectionPackMaker(feInfo);
    return childPackMaker.makeSectionPack();
  }
  private rawDescendantSections(): RawSections<SN> {
    const { selfAndDescendantFeIds } = this.get;
    return Obj.entries(
      selfAndDescendantFeIds as { [key: string]: string[] }
    ).reduce((rawSections, [name, feIdArr]) => {
      rawSections[name] = this.feIdsToRawSections(name as SN, feIdArr);
      return rawSections;
    }, {} as { [key: string]: any }) as RawSections<SN>;
  }
  private feIdsToRawSections<S extends SectionNameByType>(
    sectionName: S,
    feIdArr: string[]
  ): OneRawSection<S>[] {
    return feIdArr.map((feId) => {
      return this.makeRawSection({ sectionName, feId });
    });
  }
  private makeRawSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): OneRawSection<S> {
    const { feId, dbId, varbs, allChildFeIds } = this.get.getterSection(feInfo);
    return {
      spNum: this.getSpNum(feId),
      dbId,
      dbVarbs: varbs.dbVarbs,
      childSpNums: this.childFeIdsToSpNums(allChildFeIds),
    };
  }
  private childFeIdsToSpNums<S extends SectionName>(
    childFeIds: ChildIdArrsWide<S>
  ): ChildSpNums<S> {
    return Obj.keys(childFeIds).reduce((childSpNums, childName) => {
      const feIds = childFeIds[childName];
      childSpNums[childName] = feIds.map((feId) => this.getSpNum(feId));
      return childSpNums;
    }, {} as ChildSpNums<S>);
  }
}
