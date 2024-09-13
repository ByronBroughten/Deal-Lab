import { constants } from "../Constants";
import { SectionName, sectionNames } from "./schema2SectionNames";
import {
  GeneralSectionTraits,
  GenericSectionTraits,
  SectionTraitName,
  SectionTraits,
  sectionTraits,
} from "./schema7SectionTraits/sectionTraits";

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

const checkSchema5AllSectionTraits = <AST extends GenericAllSectionTraits>(
  ast: AST
): AST => ast;

export type Schema5SectionTraits = typeof schema5SectionTraits;
export const schema5SectionTraits = checkSchema5AllSectionTraits({
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

export type GetSectionTraits<SN extends SectionName> = Schema5SectionTraits[SN];
export function getSectionTraits<SN extends SectionName>(
  sectionName: SN
): GetSectionTraits<SN> {
  return schema5SectionTraits[sectionName];
}

export type SectionTrait<
  SN extends SectionName,
  TN extends SectionTraitName
> = Schema5SectionTraits[SN][TN];
export function sectionTrait<
  SN extends SectionName,
  TN extends SectionTraitName
>(sectionName: SN, traitName: TN): Schema5SectionTraits[SN][TN] {
  return schema5SectionTraits[sectionName][traitName];
}

export type SomeSectionTraits<
  SN extends SectionName,
  PN extends SectionTraitName
> = {
  [S in SN]: Schema5SectionTraits[S][PN];
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
