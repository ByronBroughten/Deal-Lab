import {
  ChildIdArrsWide,
  ChildName,
  FeChildInfo,
} from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { ChildSectionPack } from "../SectionsMeta/sectionChildrenDerived/ChildSectionPack";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import {
  ChildSpNums,
  OneRawSection,
  RawSections,
} from "../SectionsMeta/sectionChildrenDerived/SectionPack/RawSection";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../StateGetters/Bases/GetterSectionBase";
import {
  GetterSection,
  GetterSectionRequiredProps,
} from "../StateGetters/GetterSection";
import { StateSections } from "../StateSections/StateSections";
import { Obj } from "../utils/Obj";

export type SectionPackArrs<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = {
  [C in CN]: ChildSectionPack<SN, C>[];
};

type MakeFromSectionsProps<SN extends SectionName> = {
  sections: StateSections;
  sectionName: SN;
};
export class PackMakerSection<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  static init<SN extends SectionName>(props: GetterSectionRequiredProps<SN>) {
    return new PackMakerSection(GetterSection.initSectionProps(props));
  }
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
      ...this.initProps({ sections }),
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
  ): SectionPackArrs<SN, CN> {
    return childNames.reduce((spArrs, childName) => {
      (spArrs[childName] as any) = this.makeChildPackArr(childName);
      return spArrs;
    }, {} as SectionPackArrs<SN, CN>);
  }
  makeChildPackArr<CN extends ChildName<SN>>(
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
      ...this.getterSectionsProps,
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
  private rawDescendantSections(): RawSections {
    const { selfAndDescendantFeIds } = this.get;
    return Obj.keys(selfAndDescendantFeIds).reduce((rawSections, name) => {
      rawSections[name] = this.feIdsToRawSections(
        name as SN,
        selfAndDescendantFeIds[name]
      ) as OneRawSection[];
      return rawSections;
    }, {} as RawSections);
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
    const { feId, dbId, allChildFeIds, dbVarbs } =
      this.get.getterSection(feInfo);

    return {
      spNum: this.getSpNum(feId),
      dbId,
      dbVarbs,
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
