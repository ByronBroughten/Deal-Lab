import {
  SectionPathContextName,
  indexesForSpecifiers,
} from "../sectionPaths/sectionPathContexts";
import { StoreName } from "../sectionStores";
import {
  ChildName,
  sectionToChildNames,
} from "../sectionVarbsConfigDerived/sectionChildrenDerived/ChildName";
import { Merge } from "../utils/Obj/merge";
import { SectionName, sectionNames } from "./SectionName";

type GenericAllChildrenTraits = {
  [SN in SectionName]: GenericChildrenTraits<SN>;
};
function checkAllChildrenTraits<RCS extends GenericAllChildrenTraits>(
  rcs: RCS
): RCS {
  return rcs;
}

const defaultRelChild = makeDefaultChildTraits({
  mainStoreName: null,
  sectionContextName: null,
  sectionContextSpecifier: null,
});
type DefaultRelChild = typeof defaultRelChild;

export const allChildrenTraits = checkAllChildrenTraits({
  ...makeDefaultAllChildrenTraits(),
  dealCompareCache: childrenTraits("dealCompareCache", {
    comparedDealSystem: childTraits({
      sectionContextSpecifier: indexesForSpecifiers.dealSystem,
    }),
  }),
  financing: childrenTraits("financing", {
    loan: childTraits({
      sectionContextSpecifier: indexesForSpecifiers.loan,
    }),
  }),
  main: childrenTraits("main", {
    dealCompareCache: childTraits({
      sectionContextName: "comparedDealSystem",
    }),
    feStore: childTraits({
      sectionContextName: "latentDealSystem",
    }),
    activeDealSystem: childTraits({
      sectionContextName: "activeDealSystem",
    }),
    latentDealSystem: childTraits({
      sectionContextName: "latentDealSystem",
    }),
  }),
  feStore: childrenTraits("feStore", {
    outputSection: childTraits({
      sectionContextName: "activeDealSystem",
    }),
    dealCompareMenu: childTraits({ sectionContextName: "latentDealSystem" }),
    dealMain: childTraits({
      sectionContextSpecifier: indexesForSpecifiers.deal,
    }),
  }),
  repairValue: childrenTraits("repairValue", {
    onetimeList: childTraits(storeName("repairsListMain")),
  }),
  utilityValue: childrenTraits("utilityValue", {
    periodicList: childTraits(storeName("utilitiesListMain")),
  }),
  capExValue: childrenTraits("capExValue", {
    capExList: childTraits(storeName("capExListMain")),
  }),
  closingCostValue: childrenTraits("closingCostValue", {
    onetimeList: childTraits(storeName("closingCostsListMain")),
  }),
});

type AllChildrenTraits = typeof allChildrenTraits;
export type ChildrenTraits<SN extends SectionName> = AllChildrenTraits[SN];

export type ChildTraits<
  SN extends SectionName,
  CN extends ChildName<SN>
> = ChildrenTraits<SN>[CN & keyof ChildrenTraits<SN>];

export type GenericChildTraits = {
  mainStoreName: StoreName | null;
  sectionContextName: SectionPathContextName | null;
  sectionContextSpecifier: Partial<
    Record<SectionPathContextName, number>
  > | null;
};
type GenericChildrenTraits<SN extends SectionName> = {
  [CN in ChildName<SN>]: GenericChildTraits;
};

type DefaultChildrenTraits<SN extends SectionName> = {
  [CN in ChildName<SN>]: DefaultRelChild;
};

function makeDefaultChildTraits<RC extends GenericChildTraits>(rc: RC): RC {
  return rc;
}

function storeName<CN extends StoreName>(
  storeName: CN
): {
  mainStoreName: CN;
} {
  return {
    mainStoreName: storeName,
  };
}

function childTraits<RC extends Partial<GenericChildTraits>>(
  childTraits: RC
): Merge<DefaultRelChild, RC> {
  return {
    ...defaultRelChild,
    ...childTraits,
  } as any;
}

function makeDefaultChildrenTraits<SN extends SectionName>(
  sectionName: SN
): DefaultChildrenTraits<SN> {
  const childNames = sectionToChildNames[sectionName] as ChildName<SN>[];
  return childNames.reduce((defaults, childName) => {
    defaults[childName] = defaultRelChild;
    return defaults;
  }, {} as DefaultChildrenTraits<SN>);
}
type DefaultRelChildSections = {
  [SN in SectionName]: DefaultChildrenTraits<SN>;
};
function makeDefaultAllChildrenTraits(): DefaultRelChildSections {
  return sectionNames.reduce((defaults, sectionName) => {
    (defaults[sectionName] as DefaultRelChildSections[typeof sectionName]) =
      makeDefaultChildrenTraits(sectionName);
    return defaults;
  }, {} as DefaultRelChildSections);
}

function childrenTraits<
  SN extends SectionName,
  RC extends Partial<GenericChildrenTraits<SN>>
>(sectionName: SN, children: RC): Merge<DefaultChildrenTraits<SN>, RC> {
  return {
    ...makeDefaultChildrenTraits(sectionName),
    ...children,
  } as any as Merge<DefaultChildrenTraits<SN>, RC>;
}
