import { OneRawSection, RawSections } from "../../../SectionPack/RawSection";
import {
  GeneralSectionPack,
  SectionPackRaw,
} from "../../../SectionPack/SectionPackRaw";
import { SectionFinder } from "../../../SectionsMeta/baseSectionTypes";
import { InfoS } from "../../../SectionsMeta/Info";
import { SectionName } from "../../../SectionsMeta/SectionName";
import { Obj } from "../../../utils/Obj";
import Analyzer from "./../../../Analyzer";

export function makeRawSection<SN extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<SN>
): OneRawSection<SN> {
  const { dbId, dbVarbs } = this.section(finder);
  return {
    dbId,
    dbVarbs,
    childDbIds: this.allChildDbIds(finder),
  };
}
function feIdsToRawSections<SN extends SectionName>(
  analyzer: Analyzer,
  sectionName: SN,
  feIdArr: string[]
): OneRawSection<SN>[] {
  return feIdArr.map((id) => {
    const feInfo = InfoS.fe(sectionName, id);
    return analyzer.makeRawSection(feInfo);
  });
}
export function makeRawSections<SN extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<SN>
): RawSections<SN> {
  const nestedFeIds = this.selfAndDescendantFeIds(finder);
  return Obj.entries(nestedFeIds as { [key: string]: string[] }).reduce(
    (rawSections, [name, feIdArr]) => {
      rawSections[name] = feIdsToRawSections(this, name as SN, feIdArr);
      return rawSections;
    },
    {} as { [key: string]: any }
  ) as RawSections<SN>;
}

export function makeRawSectionPack<SN extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<SN>
): SectionPackRaw<SN> {
  const { sectionName, dbId } = this.section(finder);
  return {
    sectionName: sectionName as SN,
    dbId,
    contextName: "fe",
    rawSections: this.makeRawSections(finder) as RawSections<SN>,
  } as GeneralSectionPack as any as SectionPackRaw<SN>;
}
