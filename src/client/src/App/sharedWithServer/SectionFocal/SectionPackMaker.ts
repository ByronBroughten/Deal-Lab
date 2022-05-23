import { GConstructor } from "../../utils/classObjects";
import { SectionPackRaw } from "../Analyzer/SectionPackRaw";
import {
  OneRawSection,
  RawSections,
} from "../Analyzer/SectionPackRaw/RawSection";
import { GetterSections } from "../Sections/GetterSections";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { Obj } from "../utils/Obj";
import { FocalSectionBase } from "./FocalSectionBase";
import { SectionSelfGettersProps } from "./SectionSelfGetters";

export interface SectionPackMakerI<SN extends SectionName>
  extends FocalSectionBase<SN> {
  makeSectionPack(): SectionPackRaw<SN>;
  makeChildSectionPackArrs<CN extends ChildName<SN>>(
    childNames: CN[]
  ): FeSectionPackArrs<CN>;
  makeChildSectionPackArr<CN extends ChildName<SN>>(
    sectionName: CN
  ): SectionPackRaw<CN>[];
  makeChildSectionPack<CN extends ChildName<SN>>(
    feInfo: FeSectionInfo<CN>
  ): SectionPackRaw<CN>;
}

export function ApplySectionPackMakers<
  SN extends SectionName,
  TBase extends GConstructor<FocalSectionBase<SN>>
>(Base: TBase): GConstructor<SectionPackMakerI<SN>> & TBase {
  return class SectionPackMakerNext extends Base {
    private sections = new GetterSections(this.shared);
    makeSectionPack(): SectionPackRaw<SN> {
      return {
        sectionName: this.self.sectionName,
        dbId: this.self.dbId,
        rawSections: this.rawDescendantSections(),
      };
    }
    makeChildSectionPackArrs<CN extends ChildName<SN>>(
      childNames: CN[]
    ): FeSectionPackArrs<CN> {
      return childNames.reduce((spArrs, sectionName) => {
        spArrs[sectionName] = this.makeChildSectionPackArr(sectionName);
        return spArrs;
      }, {} as FeSectionPackArrs<CN>);
    }
    makeChildSectionPackArr<CN extends ChildName<SN>>(
      sectionName: CN
    ): SectionPackRaw<CN>[] {
      const { feInfosNext } = this.sections.list(sectionName);
      return feInfosNext.map((feInfo) => this.makeChildSectionPack(feInfo));
    }
    makeChildSectionPack<CN extends ChildName<SN>>(
      feInfo: FeSectionInfo<CN>
    ): SectionPackRaw<CN> {
      const childPackMaker = SectionPackMakerNext.init({
        shared: this.shared,
        ...feInfo,
      }) as SectionPackMakerI<CN>;
      return childPackMaker.makeSectionPack();
    }
    private rawDescendantSections(): RawSections<SN> {
      const { selfAndDescendantFeIds } = this.self;
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
    private makeRawSection<SN extends SectionName>(
      feInfo: FeSectionInfo<SN>
    ): OneRawSection<SN> {
      const { dbId, varbs } = this.sections.section(feInfo);
      const focalGetter = this.sections.makeFocalGetter(feInfo);
      return {
        dbId,
        dbVarbs: varbs.db,
        childDbIds: focalGetter.allChildDbIds(),
      };
    }
    static init<S extends SectionName>(
      props: SectionSelfGettersProps<S>
    ): SectionPackMakerI<S> {
      return new SectionPackMakerNext(props) as any;
    }
  };
}

export const SectionPackMaker = ApplySectionPackMakers(FocalSectionBase);

type FeSectionPackArrs<SN extends SectionName> = {
  [S in SN]: SectionPackRaw<S>[];
};
