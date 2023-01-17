import { Obj } from "../../utils/Obj";
import { SubType } from "../../utils/types";
import { VarbName } from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { SectionName } from "../SectionName";

const sectionPathNameToSn = checkPathTypeToSectionName({
  // if any of these sectionPathNames are to be removed or invalidated
  // after deploy, then the sectionInfos stored in the db that point
  // to those sectionPathNames need to be addressed.
  dealFocal: "deal",
  propertyFocal: "property",
  loanFocal: "loan",
  mgmtFocal: "mgmt",
  calculatedVarbsFocal: "calculatedVarbs",
  userVarbItemMain: "userVarbItem",
  ongoingListMain: "ongoingList",
  ongoingItemMain: "ongoingItem",
  singleTimeListMain: "singleTimeList",
  singleTimeItemMain: "singleTimeItem",
});
type SectionPathNameToSn = typeof sectionPathNameToSn;
function checkPathTypeToSectionName<T extends Record<string, SectionName>>(
  paths: T
) {
  return paths;
}
export const sectionPathNames = Obj.keys(sectionPathNameToSn);
export type SectionPathName = keyof SectionPathNameToSn;
export function isSectionPathName(value: any): value is SectionPathName {
  return sectionPathNames.includes(value);
}

export type SectionPathVarbName<PN extends SectionPathName> = VarbName<
  PathSectionName<PN>
>;

export type PathSectionName<PN extends SectionPathName = SectionPathName> =
  SectionPathNameToSn[PN];

export type SectionNameOfPath<PN extends SectionPathName> =
  SectionPathNameToSn[PN];
export function sectionNameByPathName<PN extends SectionPathName>(
  pathName: PN
): SectionNameOfPath<PN> {
  return sectionPathNameToSn[pathName];
}

export type PathNameOfSection<SN extends SectionName> =
  keyof PathsOfSectionName<SN>;

type PathsOfSectionName<SN extends SectionName> = SubType<
  PathToSectionName,
  SN
>;
type PathToSectionName = {
  [CPN in SectionPathName]: SectionNameOfPath<CPN>;
};
