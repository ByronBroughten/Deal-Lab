import { applyMixins } from "../../../utils/classObjects";
import { SectionPackRaw } from "../../Analyzer/SectionPackRaw";
import {
  OneRawSection,
  RawSections,
} from "../../Analyzer/SectionPackRaw/RawSection";
import { FeInfo, InfoS } from "../../SectionMetas/Info";
import {
  SectionName,
  sectionNameS,
  SectionNameType,
} from "../../SectionMetas/SectionName";
import { Obj } from "../../utils/Obj";
import { HasFullSectionProps, SectionGetter } from "./FullSection";

type FeSectionPackArrs<ST extends SectionNameType> = {
  [SN in SectionName<ST & SectionNameType>]: SectionPackRaw<SN>[];
};

export class SectionPackMaker<
  SN extends SectionName
> extends HasFullSectionProps<SN> {
  get sectionPack(): SectionPackRaw<SN> {
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
  protected makeRawSections<SN extends SectionName>(
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
  protected feIdsToRawSections<SN extends SectionName>(
    sectionName: SN,
    feIdArr: string[]
  ): OneRawSection<SN>[] {
    return feIdArr.map((id) => {
      const feInfo = InfoS.fe(sectionName, id);
      return this.makeRawSection(feInfo);
    });
  }
  protected makeRawSection<SN extends SectionName>(
    feInfo: FeInfo<SN>
  ): OneRawSection<SN> {
    const { dbId, dbVarbs } = this.sections.section(feInfo);
    return {
      dbId,
      dbVarbs,
      childDbIds: this.sections.allChildDbIds(feInfo),
    };
  }
}

export interface SectionPackMaker<SN extends SectionName>
  extends SectionGetter<SN> {}
applyMixins(SectionPackMaker, [SectionGetter]);
