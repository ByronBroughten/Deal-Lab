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
    variablesMenu: "variablesMenu",
    mainDealMenu: "mainDealMenu",
    editorControls: "editorControls",

    // These are not saved
    latentDealSystem: "dealSystem",
    activeDealSystem: "dealSystem",

    // I would like to save this at some point
    // in some fashion
    dealCompare: "compareSection",

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
  compareSection: sectionChildren({
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
    buyAndHoldOutputList: sectionChild("outputList"),
    fixAndFlipOutputList: sectionChild("outputList"),
    // brrrrOutputList: sectionChild("outputList"),
  },
  outputItem: { virtualVarb: sectionChild("virtualVarb") },
  ongoingValueGroup: {
    ongoingValue: sectionChild("ongoingValue"),
  },
  ongoingValue: {
    ongoingList: sectionChild("ongoingList"),
  },

  singleTimeValue: { singleTimeList: sectionChild("singleTimeList") },
  singleTimeList: { singleTimeItem: sectionChild("singleTimeItem") },
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
    buyAndHoldProperty: "property",
    fixAndFlipProperty: "property",
    // brrrrProperty: "property",

    financing: "financing",
    mgmt: "mgmt",
  }),
  financing: { loan: sectionChild("loan") },
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
  closingCostValue: { singleTimeList: sectionChild("singleTimeList") },
  property: sectionChildren({
    unit: "unit",
    repairValue: "repairValue",
    costOverrunValue: "costOverrunValue",
    sellingCostValue: "sellingCostValue",
    utilityValue: "utilityValue",
    maintenanceValue: "maintenanceValue",
    capExValue: "capExValue",
    miscHoldingCost: "miscHoldingCost",
    miscIncomeValue: "miscIncomeValue",

    customUpfrontExpense: "singleTimeValue",
    customOngoingExpense: "ongoingValue",

    ongoingRevenueGroup: "ongoingValueGroup",
    customVarb: "customVarb",
  }),
  miscIncomeValue: sectionChildren({
    ongoingList: "ongoingList",
  }),
  miscHoldingCost: sectionChildren({
    ongoingList: "ongoingList",
  }),
  sellingCostValue: sectionChildren({
    singleTimeList: "singleTimeList",
  }),
  repairValue: sectionChildren({
    singleTimeList: "singleTimeList",
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

  mgmtGeneral: { mgmt: sectionChild("mgmt") },
  mgmt: sectionChildren({
    mgmtBasePayValue: "mgmtBasePayValue",
    vacancyLossValue: "vacancyLossValue",
    customUpfrontExpense: "singleTimeValue",
    customOngoingExpense: "ongoingValue",
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
