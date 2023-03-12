import { Obj } from "../utils/Obj";
import { relOmniParentChildren } from "./allSectionChildren/omniParentChildren";
import {
  GeneralChildSection,
  sectionChild,
} from "./allSectionChildren/sectionChild";
import {
  GeneralChildrenSections,
  sectionChildren,
} from "./allSectionChildren/sectionChildren";
import { FeDbStoreName } from "./relSectionsDerived/FeStoreName";
import { SectionName, sectionNames } from "./SectionName";

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

const listChildren = {
  repairsListMain: ["singleTimeList"],
  utilitiesListMain: ["ongoingList"],
  capExListMain: ["capExList"],
  holdingCostsListMain: ["ongoingList"],
  closingCostsListMain: ["singleTimeList"],
  outputListMain: ["outputList"],
  singleTimeListMain: ["singleTimeList"],
  ongoingListMain: ["ongoingList"],
} as const;

export const listChildrenNames: ListChildName[] = Obj.keys(listChildren);

type ListChildren = typeof listChildren;

export type ListChildName = Extract<FeDbStoreName, keyof ListChildren>;

export const allSectionChildren = checkAllSectionChildren({
  ...defaults,
  root: sectionChildren({
    omniParent: ["omniParent"],
    main: ["main"],
  }),
  omniParent: relOmniParentChildren,
  // main has feUser and each of the main app pages
  main: sectionChildren({
    feUser: ["feUser"],
    activeDealPage: ["dealPage"],
    userVarbEditor: ["userVarbEditor"],
    userListEditor: ["userListEditor"],
    variablesMenu: ["variablesMenu"],
    dealCompare: ["compareSection"],
    latentSections: ["latentSections"],
  }),
  dealPage: sectionChildren({
    deal: ["deal"],
    calculatedVarbs: ["calculatedVarbs"],
    userVarbList: ["userVarbList"],
  }),
  latentSections: sectionChildren({
    dealPage: ["dealPage"],
    userVarbList: ["userVarbList"],
    singleTimeList: ["singleTimeList"],
    ongoingList: ["ongoingList"],
  }),
  userVarbEditor: sectionChildren({
    userVarbListMain: ["userVarbList"],
  }),
  userListEditor: sectionChildren(listChildren),
  feUser: sectionChildren({
    // feUser includes everything that has a corresponding child in dbStore or that has any intermediary sections used to edit and add to them.
    propertyMainTable: ["compareTable"],
    loanMainTable: ["compareTable"],
    mgmtMainTable: ["compareTable"],
    dealMainTable: ["compareTable"],

    dealMain: ["deal"],
    propertyMain: ["property"],
    loanMain: ["loan"],
    mgmtMain: ["mgmt"],
    userVarbListMain: ["userVarbList"],
    ...listChildren,
  }),
  dbStore: sectionChildren({
    authInfoPrivate: ["authInfoPrivate"],
    userInfo: ["userInfo"],

    userInfoPrivate: ["userInfoPrivate"],

    stripeInfoPrivate: ["stripeInfoPrivate"],
    stripeSubscription: ["stripeSubscription"],

    propertyMain: ["property"],
    loanMain: ["loan"],
    mgmtMain: ["mgmt"],
    dealMain: ["deal"],
    ...listChildren,

    propertyMainTable: ["compareTable"],
    loanMainTable: ["compareTable"],
    mgmtMainTable: ["compareTable"],
    dealMainTable: ["compareTable"],
    userVarbListMain: ["userVarbList"],
  }),
  compareSection: sectionChildren({
    compareDealPage: ["dealPage"],
    compareValue: ["compareValue"],
  }),
  compareTable: sectionChildren({
    column: ["column"],
    tableRow: ["tableRow"],
    compareRow: ["proxyStoreItem"],
  }),
  tableRow: { cell: sectionChild("cell") },

  outputList: {
    outputItem: sectionChild("outputItem"),
  },
  outputItem: { virtualVarb: sectionChild("virtualVarb") },
  ongoingValueGroup: {
    ongoingValue: sectionChild("ongoingValue"),
  },
  ongoingValue: {
    ongoingList: sectionChild("ongoingList"),
  },
  singleTimeValueGroup: {
    singleTimeValue: sectionChild("singleTimeValue"),
  },
  singleTimeValue: { singleTimeList: sectionChild("singleTimeList") },
  singleTimeList: { singleTimeItem: sectionChild("singleTimeItem") },
  ongoingList: {
    ongoingItem: sectionChild("ongoingItem", {
      isListItem: true,
    }),
  },
  userVarbList: { userVarbItem: sectionChild("userVarbItem") },
  userVarbItem: {
    conditionalRowList: sectionChild("conditionalRowList"),
  },
  conditionalRowList: { conditionalRow: sectionChild("conditionalRow") },
  deal: sectionChildren({
    property: ["property"],
    financing: ["financing"],
    mgmt: ["mgmt"],
    dealOutputList: ["outputList"],
  }),
  financing: { loan: sectionChild("loan") },
  loan: sectionChildren({
    downPaymentValue: ["downPaymentValue"],
    loanBaseValue: ["loanBaseValue"],
    closingCostValue: ["closingCostValue"],
    wrappedInLoanValue: ["singleTimeValue"],
    customVarb: ["customVarb"],
  }),
  closingCostValue: { singleTimeList: sectionChild("singleTimeList") },
  propertyGeneral: { property: sectionChild("property") },
  property: sectionChildren({
    unit: ["unit"],
    repairValue: ["repairValue"],
    utilityValue: ["utilityValue"],
    maintenanceValue: ["maintenanceValue"],
    capExValue: ["capExValue"],

    upfrontExpenseGroup: ["singleTimeValueGroup"],
    upfrontRevenueGroup: ["singleTimeValueGroup"],
    ongoingExpenseGroup: ["ongoingValueGroup"],
    ongoingRevenueGroup: ["ongoingValueGroup"],
    customVarb: ["customVarb"],
  }),
  repairValue: sectionChildren({
    singleTimeList: ["singleTimeList"],
  }),
  utilityValue: sectionChildren({
    ongoingList: ["ongoingList"],
  }),
  capExValue: sectionChildren({
    capExList: ["capExList"],
  }),
  capExList: sectionChildren({
    capExItem: ["capExItem"],
  }),

  mgmtGeneral: { mgmt: sectionChild("mgmt") },
  mgmt: sectionChildren({
    mgmtBasePayValue: ["mgmtBasePayValue"],
    vacancyLossValue: ["vacancyLossValue"],
    upfrontExpenseGroup: ["singleTimeValueGroup"],
    ongoingExpenseGroup: ["ongoingValueGroup"],
    customVarb: ["customVarb"],
  }),
});

export type AllSectionChildren = typeof allSectionChildren;
export type SectionChildProps<PN extends keyof GeneralChildSection> = {
  [SN in keyof AllSectionChildren]: {
    [CN in keyof AllSectionChildren[SN]]: AllSectionChildren[SN][CN][PN &
      keyof AllSectionChildren[SN][CN]];
  };
};
