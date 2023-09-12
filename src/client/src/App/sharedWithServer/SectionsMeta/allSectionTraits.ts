import { constants } from "../../Constants";
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
  outputSection: sectionTraits({
    defaultStoreName: "outputSection",
  }),
  dealCompareMenu: sectionTraits({
    defaultStoreName: "dealCompareMenu",
  }),
  deal: sectionTraits({
    displayName: constants.appUnit,
    defaultStoreName: "dealMain",
  }),
  loan: sectionTraits({
    defaultStoreName: "loanMain",
  }),
  property: sectionTraits({
    defaultStoreName: "propertyMain",
  }),
  mgmt: sectionTraits({
    defaultStoreName: "mgmtMain",
  }),
  capExList: sectionTraits({
    defaultStoreName: "capExListMain",
    varbListItem: "capExItem",
  }),
  outputList: sectionTraits({
    varbListItem: "outputItem",
    defaultStoreName: "outputListMain",
  }),
  onetimeList: sectionTraits({
    defaultStoreName: "onetimeListMain",
    varbListItem: "onetimeItem",
  }),
  periodicList: sectionTraits({
    defaultStoreName: "ongoingListMain",
    varbListItem: "periodicItem",
  }),
  numVarbList: sectionTraits({
    defaultStoreName: "numVarbListMain",
    varbListItem: "numVarbItem",
  }),
});

export type GetSectionTraits<SN extends SectionName> = AllSectionTraits[SN];
export function getSectionTraits<SN extends SectionName>(
  sectionName: SN
): GetSectionTraits<SN> {
  return allSectionTraits[sectionName];
}

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
