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
const sCdn = sectionChildren;
export const allSectionChildren = checkAllSectionChildren({
  ...defaults,
  root: sCdn({
    omniParent: "omniParent",
    main: "main",
  }),
  omniParent: relOmniParentChildren,
  main: sCdn({
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
  sessionStore: sCdn({
    dealMain: "sessionDeal",
  }),
  sessionDeal: sCdn({
    sessionVarb: "sessionVarb",
  }),
  sessionSection: sCdn({
    sessionVarb: "sessionVarb",
  }),
  feStore: sCdn(sectionStores),
  dbStore: sCdn({
    // these are mimicked by the front-end
    ...sectionStores,
    // these are unique to the db
    userInfo: "userInfo",
    userInfoPrivate: "userInfoPrivate",
    authInfoPrivate: "authInfoPrivate",
    stripeInfoPrivate: "stripeInfoPrivate",
    stripeSubscription: "stripeSubscription",
  }),

  dealSystem: sCdn({
    deal: "deal",
    calculatedVarbs: "calculatedVarbs",
    numVarbList: "numVarbList",
    boolVarbList: "boolVarbList",
  }),
  dealCompareMenu: sCdn({
    comparedDeal: "comparedDeal",
    outputList: "outputList",
  }),
  dealCompareCache: sCdn({ comparedDealSystem: "dealSystem" }),
  outputList: sCdn({ outputItem: "outputItem" }),
  outputSection: sCdn({
    homeBuyerOutputList: "outputList",
    buyAndHoldOutputList: "outputList",
    fixAndFlipOutputList: "outputList",
    brrrrOutputList: "outputList",
  }),
  onetimeList: { onetimeItem: sectionChild("onetimeItem") },
  periodicList: {
    periodicItem: sectionChild("periodicItem", { isListItem: true }),
  },
  periodicItem: sCdn({ valueDollarsEditor: "periodicEditor" }),
  numVarbList: { numVarbItem: sectionChild("numVarbItem") },
  boolVarbList: { boolVarbItem: sectionChild("boolVarbItem") },
  numVarbItem: {
    conditionalRowList: sectionChild("conditionalRowList"),
  },
  conditionalRowList: { conditionalRow: sectionChild("conditionalRow") },
  deal: sCdn({
    property: "property",
    purchaseFinancing: "financing",
    refiFinancing: "financing",
    mgmtOngoing: "mgmt",
  }),
  financing: {
    loan: sectionChild("loan"),
    timeTillRefinance: sectionChild("timespanEditor"),
  },
  loan: sCdn({
    loanBaseValue: "loanBaseValue",
    interestRateEditor: "periodicEditor",
    loanTermEditor: "timespanEditor",

    closingCostValue: "closingCostValue",
    customVarb: "customVarb",
    mortgageInsUpfrontValue: "mortgageInsUpfrontValue",
    mortgageInsPeriodicValue: "mortgageInsPeriodicValue",
    prepaidTaxes: "prepaidPeriodic",
    prepaidHomeIns: "prepaidPeriodic",
    prepaidInterest: "prepaidDaily",
  }),
  mortgageInsPeriodicValue: sCdn({
    dollarsEditor: "periodicEditor",
    percentEditor: "periodicEditor",
  }),
  prepaidPeriodic: sCdn({
    timespanEditor: "timespanEditor",
  }),
  loanBaseValue: sCdn({
    customLoanBase: "customLoanBase",
    loanBaseExtra: "loanBaseExtra",
    purchaseLoanValue: "purchaseLoanValue",
    repairLoanValue: "repairLoanValue",
    arvLoanValue: "arvLoanValue",
  }),
  loanBaseExtra: sCdn({ onetimeList: "onetimeList" }),
  customLoanBase: sCdn({ onetimeList: "onetimeList" }),
  closingCostValue: { onetimeList: sectionChild("onetimeList") },
  property: sCdn({
    unit: "unit",
    miscOngoingRevenue: "miscPeriodicValue",

    repairValue: "repairValue",
    delayedCostValue: "delayedCostValue",

    costOverrunValue: "costOverrunValue",
    sellingCostValue: "sellingCostValue",
    miscOnetimeCost: "miscOnetimeValue",

    holdingPeriod: "timespanEditor",

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
  unit: sCdn({ targetRentEditor: "periodicEditor" }),
  taxesValue: sCdn({ valueDollarsEditor: "periodicEditor" }),
  homeInsValue: sCdn({ valueDollarsEditor: "periodicEditor" }),
  utilityValue: sCdn({
    valueDollarsEditor: "periodicEditor",
    periodicList: "periodicList",
  }),
  maintenanceValue: sCdn({ valueDollarsEditor: "periodicEditor" }),
  capExValue: sCdn({
    valueDollarsEditor: "periodicEditor",
    capExList: "capExList",
  }),
  capExList: sCdn({
    capExItem: "capExItem",
  }),

  miscPeriodicValue: sCdn({
    periodicList: "periodicList",
    periodicEditor: "periodicEditor",
  }),
  miscOnetimeValue: sCdn({
    onetimeList: "onetimeList",
  }),
  sellingCostValue: sCdn({
    onetimeList: "onetimeList",
  }),
  repairValue: sCdn({
    onetimeList: "onetimeList",
  }),
  delayedCostValue: sCdn({
    onetimeList: "onetimeList",
  }),
  capExItem: sCdn({ lifespanEditor: "timespanEditor" }),
  mgmt: sCdn({
    mgmtBasePayValue: "mgmtBasePayValue",
    vacancyLossValue: "vacancyLossValue",
    miscOngoingCost: "miscPeriodicValue",
    miscOnetimeCost: "miscOnetimeValue",
    customVarb: "customVarb",
  }),
  mgmtBasePayValue: sCdn({
    valueDollarsEditor: "periodicEditor",
  }),
  vacancyLossValue: sCdn({
    valueDollarsEditor: "periodicEditor",
  }),
});

export type AllSectionChildren = typeof allSectionChildren;
export type SectionChildProps<PN extends keyof GeneralChildSection> = {
  [SN in keyof AllSectionChildren]: {
    [CN in keyof AllSectionChildren[SN]]: AllSectionChildren[SN][CN][PN &
      keyof AllSectionChildren[SN][CN]];
  };
};
