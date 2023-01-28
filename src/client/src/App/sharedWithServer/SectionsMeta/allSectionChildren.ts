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
    omniParent: ["omniParent"],
    main: ["main"],
  }),
  omniParent: relOmniParentChildren,
  // main has feUser and each of the main app pages
  main: sectionChildren({
    feUser: ["feUser"],
    activeDeal: ["deal"],
    calculatedVarbs: ["calculatedVarbs"],
    latentSections: ["latentSections"],
    userVarbEditor: ["userVarbEditor"],
    userListEditor: ["userListEditor"],
  }),
  latentSections: sectionChildren({
    calculatedVarbs: ["calculatedVarbs"],
    deal: ["deal"],
    userVarbList: ["userVarbList"],
    singleTimeList: ["singleTimeList"],
    ongoingList: ["ongoingList"],
  }),
  userVarbEditor: sectionChildren({
    userVarbListMain: ["userVarbList"],
  }),
  userListEditor: sectionChildren({
    singleTimeListMain: ["singleTimeList"],
    ongoingListMain: ["ongoingList"],
  }),
  displayNameList: sectionChildren({
    displayNameItem: ["displayNameItem"],
  }),
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

    capExListMain: ["capExList"],
    outputListMain: ["outputList"],
    userVarbListMain: ["userVarbList"],
    singleTimeListMain: ["singleTimeList"],
    ongoingListMain: ["ongoingList"],
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

    propertyMainTable: ["compareTable"],
    loanMainTable: ["compareTable"],
    mgmtMainTable: ["compareTable"],
    dealMainTable: ["compareTable"],

    capExListMain: ["capExList"],

    outputListMain: ["outputList"],
    userVarbListMain: ["userVarbList"],
    singleTimeListMain: ["singleTimeList"],
    ongoingListMain: ["ongoingList"],
  }),
  compareTable: sectionChildren({
    column: ["column"],
    tableRow: ["tableRow"],
    compareRow: ["proxyStoreItem"],
  }),
  tableRow: { cell: sectionChild("cell") },
  outputList: { outputItem: sectionChild("outputItem") },

  ongoingListGroup: {
    ongoingList: sectionChild("ongoingList"),
  },
  ongoingValueGroup: {
    ongoingValue: sectionChild("ongoingValue"),
  },
  ongoingValue: {
    ongoingList: sectionChild("ongoingList"),
  },
  singleTimeListGroup: {
    singleTimeList: sectionChild("singleTimeList"),
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
    closingCostValue: ["singleTimeValue"],
    wrappedInLoanValue: ["singleTimeValue"],
    customVarb: ["customVarb"],
  }),
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
    capExList: ["ongoingList"],
    capExListNext: ["capExList"],
  }),
  capExList: sectionChildren({
    capExItem: ["capExItem"],
  }),

  mgmtGeneral: { mgmt: sectionChild("mgmt") },
  mgmt: sectionChildren({
    upfrontExpenseValue: ["singleTimeValue"],
    ongoingExpenseValue: ["ongoingValue"],
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
