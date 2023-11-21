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
import { sectionStores } from "./sectionStores";

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
    dealCompareDealSelectMenu: "dealCompareDealSelectMenu",

    // These are not saved
    dealCompareCache: "dealCompareCache",
    sessionStore: "sessionStore",

    latentDealSystem: "dealSystem",
    activeDealSystem: "dealSystem",
  }),
  sessionStore: sectionChildren({
    dealMain: "sessionDeal",
  }),
  sessionDeal: sectionChildren({
    sessionVarb: "sessionVarb",
  }),
  sessionSection: sectionChildren({
    sessionVarb: "sessionVarb",
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
  dealCompareMenu: sectionChildren({
    comparedDeal: "comparedDeal",
    outputList: "outputList",
  }),
  dealCompareCache: sectionChildren({ comparedDealSystem: "dealSystem" }),
  outputList: {
    outputItem: sectionChild("outputItem"),
  },
  outputSection: sectionChildren({
    homeBuyerOutputList: "outputList",
    buyAndHoldOutputList: "outputList",
    fixAndFlipOutputList: "outputList",
    brrrrOutputList: "outputList",
  }),
  outputItem: { virtualVarb: sectionChild("virtualVarb") },
  onetimeList: { onetimeItem: sectionChild("onetimeItem") },
  periodicList: {
    periodicItem: sectionChild("periodicItem", { isListItem: true }),
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
    mgmtOngoing: "mgmt",
  }),
  financing: {
    loan: sectionChild("loan"),
    purchaseLoan: sectionChild("loan"),
    refinanceLoan: sectionChild("loan"),
  },
  loan: sectionChildren({
    loanBaseValue: "loanBaseValue",
    closingCostValue: "closingCostValue",
    customVarb: "customVarb",
    mortgageInsUpfrontValue: "mortgageInsUpfrontValue",
    mortgageInsPeriodicValue: "mortgageInsPeriodicValue",
    prepaidTaxes: "prepaidPeriodic",
    prepaidHomeIns: "prepaidPeriodic",
    prepaidInterest: "prepaidDaily",
  }),
  prepaidPeriodic: sectionChildren({
    timespanEditor: "timespanEditor",
  }),
  loanBaseValue: sectionChildren({
    customLoanBase: "customLoanBase",
    loanBaseExtra: "loanBaseExtra",
    purchaseLoanValue: "purchaseLoanValue",
    repairLoanValue: "repairLoanValue",
    arvLoanValue: "arvLoanValue",
  }),
  loanBaseExtra: sectionChildren({ onetimeList: "onetimeList" }),
  customLoanBase: sectionChildren({ onetimeList: "onetimeList" }),
  closingCostValue: { onetimeList: sectionChild("onetimeList") },
  property: sectionChildren({
    unit: "unit",
    miscOngoingRevenue: "miscPeriodicValue",

    repairValue: "repairValue",
    delayedCostValue: "delayedCostValue",

    costOverrunValue: "costOverrunValue",
    sellingCostValue: "sellingCostValue",
    miscOnetimeCost: "miscOnetimeValue",

    taxesOngoing: "taxesValue",
    homeInsOngoing: "homeInsValue",
    utilityOngoing: "utilityValue",
    maintenanceOngoing: "maintenanceValue",
    capExValueOngoing: "capExValue",
    miscOngoingCost: "miscPeriodicValue",

    homeInsHolding: "homeInsValue",
    taxesHolding: "taxesValue",
    utilityHolding: "utilityValue",
    miscHoldingCost: "miscPeriodicValue",

    customVarb: "customVarb",
  }),
  miscPeriodicValue: sectionChildren({
    periodicList: "periodicList",
  }),
  miscOnetimeValue: sectionChildren({
    onetimeList: "onetimeList",
  }),
  sellingCostValue: sectionChildren({
    onetimeList: "onetimeList",
  }),
  repairValue: sectionChildren({
    onetimeList: "onetimeList",
  }),
  delayedCostValue: sectionChildren({
    onetimeList: "onetimeList",
  }),
  utilityValue: sectionChildren({
    periodicList: "periodicList",
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
    miscOngoingCost: "miscPeriodicValue",
    miscOnetimeCost: "miscOnetimeValue",
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
