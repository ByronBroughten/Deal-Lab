import { SectionName, sectionNames } from "./SectionName";
import {
  GeneralSectionTraits,
  GenericSectionTraits,
  SectionTraitName,
  sectionTraits,
  SectionTraits,
} from "./sectionsTraits/sectionTraits";

export type GeneralAllSectionTraits = {
  [SN in SectionName]: GeneralSectionTraits;
};

type GenericAllSectionTraits = {
  [SN in SectionName]: GenericSectionTraits<SN>;
};

type DefaultSectionTraits = {
  [SN in SectionName]: SectionTraits<SN>;
};

const defaultSectionTraits = sectionNames.reduce((defaultSt, sectionName) => {
  defaultSt[sectionName] = sectionTraits();
  return defaultSt;
}, {} as DefaultSectionTraits);

const checkAllSectionTraits = <AST extends GenericAllSectionTraits>(
  ast: AST
): AST => ast;

export type AllSectionTraits = typeof allSectionTraits;
export const allSectionTraits = checkAllSectionTraits({
  ...defaultSectionTraits,
  deal: sectionTraits({
    displayName: "Deal",
    hasGlobalVarbs: true,
    compareTableName: "dealMainTable",
    feFullIndexStoreName: "dealMain",

    dbIndexStoreName: "dealMain",
  }),
  loan: sectionTraits({
    compareTableName: "loanMainTable",
    feFullIndexStoreName: "loanMain",
    dbIndexStoreName: "loanMain",
  }),
  property: sectionTraits({
    compareTableName: "propertyMainTable",
    feFullIndexStoreName: "propertyMain",
    dbIndexStoreName: "propertyMain",
  }),
  mgmt: sectionTraits({
    compareTableName: "mgmtMainTable",
    feFullIndexStoreName: "mgmtMain",
    dbIndexStoreName: "mgmtMain",
  }),
  outputList: sectionTraits({
    varbListItem: "outputItem",
    feFullIndexStoreName: "outputListMain",
    dbIndexStoreName: "outputListMain",
  }),
  singleTimeList: sectionTraits({
    varbListItem: "singleTimeItem",
    feFullIndexStoreName: "singleTimeListMain",
    dbIndexStoreName: "singleTimeListMain",
  }),
  ongoingList: sectionTraits({
    varbListItem: "ongoingItem",
    feFullIndexStoreName: "ongoingListMain",
    dbIndexStoreName: "ongoingListMain",
  }),
  userVarbList: sectionTraits({
    feFullIndexStoreName: "userVarbListMain",
    dbIndexStoreName: "userVarbListMain",
    varbListItem: "userVarbItem",
  }),
  propertyGeneral: sectionTraits({
    displayName: "Property",
    hasGlobalVarbs: true,
  }),
  financing: sectionTraits({
    displayName: "Financing",
    hasGlobalVarbs: true,
  }),
  mgmtGeneral: sectionTraits({
    displayName: "Management",
    hasGlobalVarbs: true,
  }),
});

export type SectionTrait<
  SN extends SectionName,
  TN extends SectionTraitName
> = AllSectionTraits[SN][TN];
export function sectionTrait<
  SN extends SectionName,
  TN extends SectionTraitName
>(sectionName: SN, traitName: TN): AllSectionTraits[SN][TN] {
  return allSectionTraits[sectionName][traitName];
}

export type SomeSectionTraits<
  SN extends SectionName,
  PN extends SectionTraitName
> = {
  [S in SN]: AllSectionTraits[S][PN];
};
export function getSomeSectionTraits<
  SN extends SectionName,
  TN extends SectionTraitName
>(sNames: SN[], traitName: TN) {
  return sNames.reduce((traits, sectionName) => {
    traits[sectionName] = sectionTrait(sectionName, traitName);
    return traits;
  }, {} as SomeSectionTraits<SN, TN>);
}
