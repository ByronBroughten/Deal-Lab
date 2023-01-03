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
    latentSections: ["latentSections"],
    userVarbEditor: ["userVarbEditor"],
    userListEditor: ["userListEditor"],
  }),
  latentSections: sectionChildren({
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
    propertyMain: ["property"],
    loanMain: ["loan"],
    mgmtMain: ["mgmt"],
    dealMain: ["deal"],
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
  singleTimeValueGroup: {
    singleTimeList: sectionChild("singleTimeList"),
    singleTimeValue: sectionChild("singleTimeValue"),
  },
  ongoingListGroup: { ongoingList: sectionChild("ongoingList") },
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
    propertyGeneral: ["propertyGeneral"],
    financing: ["financing"],
    mgmtGeneral: ["mgmtGeneral"],
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
    upfrontExpenseGroup: ["singleTimeValueGroup"],
    upfrontRevenueGroup: ["singleTimeValueGroup"],
    ongoingCostListGroup: ["ongoingListGroup"],
    ongoingRevenueListGroup: ["ongoingListGroup"],
    unit: ["unit"],
    customVarb: ["customVarb"],
  }),
  mgmtGeneral: { mgmt: sectionChild("mgmt") },
  mgmt: sectionChildren({
    upfrontExpenseGroup: ["singleTimeValueGroup"],
    ongoingCostListGroup: ["ongoingListGroup"],
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
