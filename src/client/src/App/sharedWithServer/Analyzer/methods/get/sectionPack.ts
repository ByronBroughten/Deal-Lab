import { Obj } from "../../../utils/Obj";
import { GeneralSectionPack, RawSectionPack } from "../../RawSectionPack";
import { Inf } from "../../SectionMetas/Info";
import { SectionFinder } from "../../SectionMetas/relSections/baseSectionTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { OneRawSection, RawSections } from "../../SectionPacks/RawSection";
import Analyzer from "./../../../Analyzer";

export function makeRawSection<SN extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<SN>
): OneRawSection<SN, "fe"> {
  const { dbId, dbVarbs } = this.section(finder);
  return {
    dbId,
    dbVarbs,
    childDbIds: this.allChildDbIds(finder),
  };
}
function feIdsToRawSections<S extends SectionName>(
  analyzer: Analyzer,
  sectionName: S,
  feIdArr: string[]
): OneRawSection<S, "fe">[] {
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
): RawSectionPack<SN, "fe"> {
  const { sectionName, dbId } = this.section(finder);
  return {
    sectionName: sectionName as SN,
    dbId,
    contextName: "fe",
    rawSections: this.makeRawSections(finder) as RawSections<SN, "fe">,
  } as GeneralSectionPack as any as RawSectionPack<SN, "fe">;
}
