import { BaseName } from "../baseSectionTypes";
import { relSections, RelSections } from "../relSections";
import { GeneralRelSection } from "../relSections/rel/relSection";

export type RelParams<
  SN extends BaseName,
  PN extends keyof GeneralRelSection
> = {
  [S in SN]: RelSections["fe"][S][PN];
};
export function getRelParams<
  SN extends BaseName,
  PN extends keyof GeneralRelSection
>(nameArr: SN[], paramName: PN) {
  return nameArr.reduce((relParams, sectionName) => {
    relParams[sectionName] = relSections.fe[sectionName][paramName];
    return relParams;
  }, {} as RelParams<SN, PN>);
}
