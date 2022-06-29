import { OneRawSection, RawSections } from "../SectionPack/RawSection";
import { SectionPack } from "../SectionPack/SectionPack";
import {
  ChildName,
  ChildType,
  FeChildInfo,
} from "../SectionsMeta/childSectionsDerived/ChildTypes";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionBase } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { Obj } from "../utils/Obj";

type FeSectionPackArrs<SN extends SectionName> = {
  [S in SN]: SectionPack<S>[];
};

export class PackMakerSection<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  get = new GetterSection(this.getterSectionProps);
  makeSectionPack(): SectionPack<SN> {
    return {
      sectionName: this.sectionName,
      dbId: this.get.dbId,
      rawSections: this.rawDescendantSections(),
    };
  }
  makeChildTypePackArrs<CN extends ChildName<SN>>(
    childNames: CN[]
  ): FeSectionPackArrs<ChildType<SN, CN>> {
    return childNames.reduce((spArrs, childName) => {
      const sectionName = this.get.meta.childType(childName);
      (spArrs[sectionName] as any) = this.makeChildSectionPackArr(childName);
      return spArrs;
    }, {} as FeSectionPackArrs<ChildType<SN, CN>>);
  }
  makeChildSectionPackArr<CN extends ChildName<SN>>(
    childName: CN
  ): SectionPack<ChildType<SN, CN>>[] {
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
  ): SectionPack<ChildType<SN, CN>> {
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
