import { GConstructor } from "../../../utils/classObjects";
import { SectionPackRaw } from "../../Analyzer/SectionPackRaw";
import {
  OneRawSection,
  RawSections,
} from "../../Analyzer/SectionPackRaw/RawSection";
import {
  FullSectionBase,
  FullSectionBaseI,
} from "../../SectionFocal/FocalSectionBase";
import { FeInfo, InfoS } from "../../SectionsMeta/Info";
import {
  SectionName,
  sectionNameS,
  SectionNameType,
} from "../../SectionsMeta/SectionName";
import { Obj } from "../../utils/Obj";

type FeSectionPackArrs<ST extends SectionNameType> = FeSectionPackArrsBySN<
  SectionName<ST>
>;
type FeSectionPackArrsBySN<SN extends SectionName> = {
  [S in SN]: SectionPackRaw<S>[];
};

export interface SectionPackMakerI<SN extends SectionName>
  extends FullSectionBaseI<SN> {
  get selfSectionPack(): SectionPackRaw<SN>;

  makeSectionPackArrs<ST extends SectionNameType>(
    snType: ST
  ): FeSectionPackArrs<ST>;
  makeSectionPackArr<SN extends SectionName>(
    sectionName: SN
  ): SectionPackRaw<SN>[];
  makeSectionPack<SN extends SectionName>(
    feInfo: FeInfo<SN>
  ): SectionPackRaw<SN>;
}

export function ApplySectionPackMakers<
  SN extends SectionName,
  TBase extends GConstructor<FullSectionBaseI<SN>>
>(Base: TBase): GConstructor<SectionPackMakerI<SN>> & TBase {
  return class SectionPackMakerNext
    extends Base
    implements SectionPackMakerI<SN>
  {
    get selfSectionPack(): SectionPackRaw<SN> {
      return this.makeSectionPack(this.feInfo);
    }
    makeSectionPackArrs<ST extends SectionNameType>(
      snType: ST
    ): FeSectionPackArrs<ST> {
      const sectionNames = sectionNameS.arrs[snType] as string[];
      return sectionNames.reduce((spArrs, sectionName) => {
        spArrs[sectionName] = this.makeSectionPackArr(
          sectionName as SectionName<ST>
        );
        return spArrs;
      }, {} as { [key: string]: any[] }) as any;
    }
    makeSectionPackArr<SN extends SectionName>(
      sectionName: SN
    ): SectionPackRaw<SN>[] {
      const { feInfos } = this.sections.list(sectionName);
      return feInfos.map((feInfo) => this.makeSectionPack(feInfo));
    }
    makeSectionPack<SN extends SectionName>(
      feInfo: FeInfo<SN>
    ): SectionPackRaw<SN> {
      const { sectionName, dbId } = this.sections.section(feInfo);
      return {
        sectionName: sectionName as SN,
        dbId,
        rawSections: this.makeRawSections(feInfo) as RawSections<SN>,
      } as SectionPackRaw<SN>;
    }
    private makeRawSections<SN extends SectionName>(
      feInfo: FeInfo<SN>
    ): RawSections<SN> {
      const nestedFeIds = this.sections.selfAndDescendantFeIds(feInfo);
      return Obj.entries(nestedFeIds as { [key: string]: string[] }).reduce(
        (rawSections, [name, feIdArr]) => {
          rawSections[name] = this.feIdsToRawSections(name as SN, feIdArr);
          return rawSections;
        },
        {} as { [key: string]: any }
      ) as RawSections<SN>;
    }
    private feIdsToRawSections<SN extends SectionName>(
      sectionName: SN,
      feIdArr: string[]
    ): OneRawSection<SN>[] {
      return feIdArr.map((id) => {
        const feInfo = InfoS.fe(sectionName, id);
        return this.makeRawSection(feInfo);
      });
    }
    private makeRawSection<SN extends SectionName>(
      feInfo: FeInfo<SN>
    ): OneRawSection<SN> {
      const { dbId, varbs } = this.sections.section(feInfo);
      return {
        dbId,
        dbVarbs: varbs.db,
        childDbIds: this.sections.allChildDbIds(feInfo),
      };
    }
  };
}

export const SectionPackMakerNext = ApplySectionPackMakers(FullSectionBase);