import { Merge } from "../utils/Obj/merge";
import {
  ChildName,
  sectionToChildNames,
} from "./sectionChildrenDerived/ChildName";
import { SectionName, sectionNames } from "./SectionName";
import {
  indexesForSpecifiers,
  SectionPathContextName,
} from "./sectionPathContexts";
import { StoreName } from "./sectionStores";

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
const defaultRelChild = makeDefaultChildTraits({
  mainStoreName: null,
  sectionContextName: null,
  sectionContextSpecifier: null,
});
type DefaultRelChild = typeof defaultRelChild;

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
    defaults[sectionName] = makeDefaultChildrenTraits(sectionName);
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

type GenericAllChildrenTraits = {
  [SN in SectionName]: GenericChildrenTraits<SN>;
};
function checkAllChildrenTraits<RCS extends GenericAllChildrenTraits>(
  rcs: RCS
): RCS {
  return rcs;
}

export const allChildrenTraits = checkAllChildrenTraits({
  ...makeDefaultAllChildrenTraits(),
  userListEditor: childrenTraits("userListEditor", {
    repairsListMain: childTraits(storeName("repairsListMain")),
    utilitiesListMain: childTraits(storeName("utilitiesListMain")),
    capExListMain: childTraits(storeName("capExListMain")),
    holdingCostsListMain: childTraits(storeName("holdingCostsListMain")),
    closingCostsListMain: childTraits(storeName("closingCostsListMain")),
    outputListMain: childTraits(storeName("outputListMain")),
    numVarbListMain: childTraits(storeName("numVarbListMain")),
    onetimeListMain: childTraits(storeName("onetimeListMain")),
    ongoingListMain: childTraits(storeName("ongoingListMain")),
  }),
  dealCompareMenu: childrenTraits("dealCompareMenu", {
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
    feStore: childTraits({
      sectionContextName: "latentDealSystem",
    }),
    activeDealSystem: childTraits({
      sectionContextName: "activeDealSystem",
    }),
    latentDealSystem: childTraits({
      sectionContextName: "latentDealSystem",
    }),
    dealCompare: childTraits({
      sectionContextName: "comparedDealSystem",
    }),
    userVarbEditor: childTraits({
      sectionContextName: "latentDealSystem",
    }),
    userListEditor: childTraits({
      sectionContextName: "latentDealSystem",
    }),
  }),
  feStore: childrenTraits("feStore", {
    outputSection: childTraits({
      sectionContextName: "activeDealSystem",
    }),
    dealMain: childTraits({
      sectionContextSpecifier: indexesForSpecifiers.deal,
    }),
  }),
  repairValue: childrenTraits("repairValue", {
    onetimeList: childTraits(storeName("repairsListMain")),
  }),
  utilityValue: childrenTraits("utilityValue", {
    ongoingList: childTraits(storeName("utilitiesListMain")),
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
