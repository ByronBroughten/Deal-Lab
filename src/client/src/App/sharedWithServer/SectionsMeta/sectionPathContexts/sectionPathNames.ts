import { Obj } from "../../utils/Obj";
import { SubType } from "../../utils/types";
import { VarbName } from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { ChildName } from "../sectionChildrenDerived/ChildName";
import { SectionName } from "../SectionName";

const sectionPathNameToSn = checkPathTypeToSectionName({
  // if any of these sectionPathNames are to be removed or invalidated after deploy, then the sectionInfos stored in the db that point to those sectionPathNames need to be addressed.
  dealSystemFocal: "dealSystem",
  dealFocal: "deal",

  propertyFocal: "property",
  unitFocal: "unit",
  repairCostFocal: "repairValue",
  utilityCostFocal: "utilityValue",
  capExCostFocal: "capExValue",

  costOverrunFocal: "costOverrunValue",
  sellingCostFocal: "sellingCostValue",
  miscHoldingCostFocal: "miscHoldingCost",
  miscIncomeFocal: "miscRevenueValue",

  financingFocal: "financing",
  loanFocal: "loan",
  loanBaseFocal: "loanBaseValue",
  purchaseLoanFocal: "purchaseLoanValue",
  repairLoanFocal: "repairLoanValue",
  arvLoanFocal: "arvLoanValue",
  closingCostFocal: "closingCostValue",

  mgmtFocal: "mgmt",
  mgmtBasePayFocal: "mgmtBasePayValue",
  vacancyLossFocal: "vacancyLossValue",

  calculatedVarbsFocal: "calculatedVarbs",
  numVarbListMain: "numVarbList",
  numVarbItemMain: "numVarbItem",
});

export type AbsolutePathNode = {
  childName: ChildName;
  feId?: string;
};

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

export type SectionPathVarbName<PN extends SectionPathName = SectionPathName> =
  VarbName<PathSectionName<PN>>;

export type PathSectionName<PN extends SectionPathName = SectionPathName> =
  SectionPathNameToSn[PN];

export type SectionNameOfPath<PN extends SectionPathName> =
  SectionPathNameToSn[PN];
export function pathSectionName<PN extends SectionPathName>(
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
