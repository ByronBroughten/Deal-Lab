import { SimpleSectionName } from "../../baseSections";
import { BaseName } from "../../baseSectionsDerived/baseSectionTypes";
import { relSections, RelSections } from "../../relSections";
import { GeneralRelSection } from "../../relSectionsUtils/relSection";

export type RelParams<
  SN extends SimpleSectionName,
  PN extends keyof GeneralRelSection
> = {
  [S in SN]: RelSections[S][PN];
};
export function getRelParams<
  SN extends BaseName,
  PN extends keyof GeneralRelSection
>(nameArr: SN[], paramName: PN) {
  return nameArr.reduce((relParams, sectionName) => {
    relParams[sectionName] = relSections[sectionName][paramName];
    return relParams;
  }, {} as RelParams<SN, PN>);
}
