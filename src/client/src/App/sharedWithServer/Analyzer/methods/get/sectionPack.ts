import { SectionFinder } from "../../../SectionMetas/baseSectionTypes";
import { Inf } from "../../../SectionMetas/Info";
import { SectionName } from "../../../SectionMetas/SectionName";
import { Obj } from "../../../utils/Obj";
import { GeneralSectionPack, SectionPackRaw } from "../../SectionPackRaw";
import { OneRawSection, RawSections } from "../../SectionPackRaw/RawSection";
import Analyzer from "./../../../Analyzer";

export function makeRawSection<SN extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<SN>
): OneRawSection<"fe", SN> {
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
): OneRawSection<"fe", SN>[] {
  return feIdArr.map((id) => {
    const feInfo = Inf.fe(sectionName, id);
    return analyzer.makeRawSection(feInfo);
  });
}
export function makeRawSections<SN extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<SN>
): RawSections<SN, "fe"> {
  const nestedFeIds = this.selfAndDescendantFeIds(finder);
  return Obj.entries(nestedFeIds as { [key: string]: string[] }).reduce(
    (rawSections, [name, feIdArr]) => {
      rawSections[name] = feIdsToRawSections(this, name as SN, feIdArr);
      return rawSections;
    },
    {} as { [key: string]: any }
  ) as RawSections<SN, "fe">;
}

export function makeRawSectionPack<SN extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<SN>
): SectionPackRaw<"fe", SN> {
  const { sectionName, dbId } = this.section(finder);
  return {
    sectionName: sectionName as SN,
    dbId,
    contextName: "fe",
    rawSections: this.makeRawSections(finder) as RawSections<SN, "fe">,
  } as GeneralSectionPack as any as SectionPackRaw<"fe", SN>;
}
