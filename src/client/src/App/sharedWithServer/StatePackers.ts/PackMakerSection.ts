import { SimpleSectionName } from "../SectionsMeta/baseSectionsVarbs";
import {
  ChildName,
  FeChildInfo,
} from "../SectionsMeta/childSectionsDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/childSectionsDerived/ChildSectionName";
import { ChildSectionPack } from "../SectionsMeta/childSectionsDerived/ChildSectionPack";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import {
  OneRawSection,
  RawSections,
} from "../SectionsMeta/childSectionsDerived/SectionPack/RawSection";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionBase } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { StateSections } from "../StateSections/StateSections";
import { Obj } from "../utils/Obj";

type FeSectionPackArrs<
  SN extends SimpleSectionName,
  CN extends ChildName<SN>
> = {
  [C in CN]: ChildSectionPack<SN, C>[];
};

type MakeFromSectionsProps<SN extends SimpleSectionName> = {
  sections: StateSections;
  sectionName: SN;
};
export class PackMakerSection<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  get get(): GetterSection<SN> {
    return new GetterSection(this.getterSectionProps);
  }
  static makeFromSections<SN extends SimpleSectionName>({
    sections,
    sectionName,
  }: MakeFromSectionsProps<SN>): PackMakerSection<SN> {
    return new PackMakerSection({
      sectionsShare: { sections },
      ...sections.onlyOneRawSection(sectionName),
    });
  }
  makeSectionPack(): SectionPack<SN> {
    return {
      sectionName: this.sectionName,
      dbId: this.get.dbId,
      rawSections: this.rawDescendantSections(),
    };
  }
  makeChildTypePackArrs<CN extends ChildName<SN>>(
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
  sectionPackMaker<S extends SectionName>(
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
  private rawDescendantSections(): RawSections<SN> {
    const { selfAndDescendantFeIds } = this.get;
    return Obj.entries(
      selfAndDescendantFeIds as { [key: string]: string[] }
    ).reduce((rawSections, [name, feIdArr]) => {
      rawSections[name] = this.feIdsToRawSections(name as SN, feIdArr);
      return rawSections;
    }, {} as { [key: string]: any }) as RawSections<SN>;
  }
  private feIdsToRawSections<S extends SectionName>(
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
    const { dbId, varbs, allChildDbIds } = this.get.getterSection(feInfo);
    return {
      dbId,
      dbVarbs: varbs.dbVarbs,
      childDbIds: allChildDbIds,
    };
  }
}
