import { relOmniParentChildren } from "./allSectionChildren/omniParentChildren";
import {
  GeneralChildSection,
  sectionChild,
} from "./allSectionChildren/sectionChild";
import {
  GeneralChildrenSections,
  sectionChildren,
} from "./allSectionChildren/sectionChildren";
import { SectionName, sectionNames } from "./SectionName";
import { listChildren, sectionStores } from "./sectionStores";

type Defaults = {
  [SN in SectionName]: {};
};
const defaults = sectionNames.reduce((defaults, sectionName) => {
  defaults[sectionName] = {};
  return defaults;
}, {} as Defaults);

type GenericChildSections = {
  [SN in SectionName]: GeneralChildrenSections;
};

function checkAllSectionChildren<CS extends GenericChildSections>(
  allSectionChildren: CS
) {
  return allSectionChildren;
}

export const allSectionChildren = checkAllSectionChildren({
  ...defaults,
  root: sectionChildren({
    omniParent: "omniParent",
    main: "main",
  }),
  omniParent: relOmniParentChildren,
  main: sectionChildren({
    // This has all the saved user data
    feStore: "feStore",

    // These are saved in local storage
    newDealMenu: "newDealMenu",
    mainDealMenu: "mainDealMenu",
    variablesMenu: "variablesMenu",
    editorControls: "editorControls",

    // These are not saved
    latentDealSystem: "dealSystem",
    activeDealSystem: "dealSystem",

    // I would like to save this at some point
    // in some fashion
    dealCompare: "dealCompareMenu",

    // these will be eliminated
    userVarbEditor: "userVarbEditor",
    userListEditor: "userListEditor",
  }),
  feStore: sectionChildren(sectionStores),
  dbStore: sectionChildren({
    // these are mimicked by the front-end
    ...sectionStores,
    // these are unique to the db
    userInfo: "userInfo",
    userInfoPrivate: "userInfoPrivate",
    authInfoPrivate: "authInfoPrivate",
    stripeInfoPrivate: "stripeInfoPrivate",
    stripeSubscription: "stripeSubscription",
  }),
  dealSystem: sectionChildren({
    deal: "deal",
    calculatedVarbs: "calculatedVarbs",
    numVarbList: "numVarbList",
    boolVarbList: "boolVarbList",
  }),
  userVarbEditor: sectionChildren({
    numVarbListMain: "numVarbList",
  }),
  userListEditor: sectionChildren(listChildren),
  dealCompareMenu: sectionChildren({
    comparedDealSystem: "dealSystem",
    compareValue: "compareValue",
  }),
  compareTable: sectionChildren({
    column: "column",
    tableRow: "tableRow",
    compareRow: "proxyStoreItem",
  }),
  tableRow: { cell: sectionChild("cell") },

  outputList: {
    outputItem: sectionChild("outputItem"),
  },
  outputSection: {
    homeBuyerOutputList: sectionChild("outputList"),
    buyAndHoldOutputList: sectionChild("outputList"),
    fixAndFlipOutputList: sectionChild("outputList"),
    brrrrOutputList: sectionChild("outputList"),
  },
  outputItem: { virtualVarb: sectionChild("virtualVarb") },
  ongoingValue: {
    ongoingList: sectionChild("ongoingList"),
  },

  singleTimeValue: { onetimeList: sectionChild("onetimeList") },
  onetimeList: { singleTimeItem: sectionChild("singleTimeItem") },
  ongoingList: {
    ongoingItem: sectionChild("ongoingItem", {
      isListItem: true,
    }),
  },
  numVarbList: { numVarbItem: sectionChild("numVarbItem") },
  boolVarbList: { boolVarbItem: sectionChild("boolVarbItem") },
  numVarbItem: {
    conditionalRowList: sectionChild("conditionalRowList"),
  },
  conditionalRowList: { conditionalRow: sectionChild("conditionalRow") },
  deal: sectionChildren({
    property: "property",
    purchaseFinancing: "financing",
    refiFinancing: "financing",
    mgmt: "mgmt",
  }),
  financing: {
    loan: sectionChild("loan"),
    purchaseLoan: sectionChild("loan"),
    refinanceLoan: sectionChild("loan"),
  },
  loan: sectionChildren({
    loanBaseValue: "loanBaseValue",
    closingCostValue: "closingCostValue",
    wrappedInLoanValue: "singleTimeValue",
    customVarb: "customVarb",
  }),
  loanBaseValue: sectionChildren({
    purchaseLoanValue: "purchaseLoanValue",
    repairLoanValue: "repairLoanValue",
    arvLoanValue: "arvLoanValue",
  }),
  closingCostValue: { onetimeList: sectionChild("onetimeList") },
  property: sectionChildren({
    unit: "unit",
    repairValue: "repairValue",
    costOverrunValue: "costOverrunValue",
    sellingCostValue: "sellingCostValue",

    utilityHolding: "utilityValue",
    utilityOngoing: "utilityValue",

    homeInsHolding: "homeInsHolding",
    homeInsOngoing: "homeInsOngoing",

    taxesHolding: "taxesHolding",
    taxesOngoing: "taxesOngoing",

    maintenanceValue: "maintenanceValue",
    capExValue: "capExValue",

    miscRevenueValue: "miscRevenueValue",
    miscOngoingCost: "miscOngoingCost",
    miscHoldingCost: "miscHoldingCost",
    miscOnetimeCost: "miscOnetimeCost",

    customVarb: "customVarb",
  }),
  miscOngoingCost: sectionChildren({
    ongoingList: "ongoingList",
  }),
  miscRevenueValue: sectionChildren({
    ongoingList: "ongoingList",
  }),
  miscHoldingCost: sectionChildren({
    ongoingList: "ongoingList",
  }),
  miscOnetimeCost: sectionChildren({
    onetimeList: "onetimeList",
  }),
  sellingCostValue: sectionChildren({
    onetimeList: "onetimeList",
  }),
  repairValue: sectionChildren({
    onetimeList: "onetimeList",
  }),
  utilityValue: sectionChildren({
    ongoingList: "ongoingList",
  }),
  capExValue: sectionChildren({
    capExList: "capExList",
  }),
  capExList: sectionChildren({
    capExItem: "capExItem",
  }),
  mgmt: sectionChildren({
    mgmtBasePayValue: "mgmtBasePayValue",
    vacancyLossValue: "vacancyLossValue",
    miscOngoingCost: "miscOngoingCost",
    miscOnetimeCost: "miscOnetimeCost",
    customVarb: "customVarb",
  }),
});

export type AllSectionChildren = typeof allSectionChildren;
export type SectionChildProps<PN extends keyof GeneralChildSection> = {
  [SN in keyof AllSectionChildren]: {
    [CN in keyof AllSectionChildren[SN]]: AllSectionChildren[SN][CN][PN &
      keyof AllSectionChildren[SN][CN]];
  };
};
