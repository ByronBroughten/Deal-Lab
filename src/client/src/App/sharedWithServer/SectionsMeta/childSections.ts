import { SimpleSectionName, simpleSectionNames } from "./baseSections";
import {
  childrenSections,
  GeneralChildrenSections,
} from "./childSectionsUtils/childrenSections";
import {
  childSection,
  GeneralChildSection,
} from "./childSectionsUtils/childSection";
import { relOmniParentChildren } from "./childSectionsUtils/omniParentChildren";

type Defaults = {
  [SN in SimpleSectionName]: {};
};
const defaults = simpleSectionNames.reduce((defaults, sectionName) => {
  defaults[sectionName] = {};
  return defaults;
}, {} as Defaults);

type GenericChildSections = {
  [SN in SimpleSectionName]: GeneralChildrenSections;
};

function checkChildSections<CS extends GenericChildSections>(
  childSections: CS
) {
  return childSections;
}

export const childSections = checkChildSections({
  ...defaults,
  root: childrenSections({
    omniParent: ["omniParent"],
    main: ["main"],
  }),
  omniParent: relOmniParentChildren,

  // main is basically no longer required.
  main: childrenSections({
    login: ["login"],
    register: ["register"],
    deal: ["deal"],
    feUser: ["feUser"],
  }),
  displayNameList: childrenSections({
    displayNameItem: ["displayNameItem"],
  }),
  feUser: childrenSections({
    // feUser includes everything that has a corresponding child in dbStore
    // or that has any intermediary sections used to edit and add to them.
    authInfo: ["authInfo"],
    subscriptionInfo: ["subscriptionInfo"],
    userInfo: ["userInfo"],

    propertyMainTable: ["compareTable"],
    loanMainTable: ["compareTable"],
    mgmtMainTable: ["compareTable"],
    dealMainTable: ["compareTable"],

    propertyNames: ["displayNameList"],
    loanNames: ["displayNameList"],
    mgmtNames: ["displayNameList"],
    dealNames: ["displayNameList"],

    outputListMain: ["outputList"],
    userVarbListMain: ["userVarbList"],
    singleTimeListMain: ["singleTimeList"],
    ongoingListMain: ["ongoingList"],
  }),
  dbStore: childrenSections({
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
  compareTable: childrenSections({
    column: ["column"],
    tableRow: ["tableRow"],
    compareRow: ["proxy"],
  }),
  tableRow: { cell: childSection("cell") },
  outputList: { outputItem: childSection("outputItem") },
  singleTimeList: { singleTimeItem: childSection("singleTimeItem") },
  ongoingList: {
    ongoingItem: childSection("ongoingItem", {
      isListItem: true,
    }),
  },
  userVarbList: { userVarbItem: childSection("userVarbItem") },
  userVarbItem: {
    conditionalRowList: childSection("conditionalRowList"),
  },
  conditionalRowList: { conditionalRow: childSection("conditionalRow") },
  deal: childrenSections({
    propertyGeneral: ["propertyGeneral"],
    financing: ["financing"],
    mgmtGeneral: ["mgmtGeneral"],
    dealOutputList: ["outputList"],
  }),
  financing: { loan: childSection("loan") },
  loan: childrenSections({
    closingCostList: ["singleTimeList"],
    wrappedInLoanList: ["singleTimeList"],
  }),
  propertyGeneral: { property: childSection("property") },
  property: childrenSections({
    upfrontCostList: ["singleTimeList"],
    upfrontRevenueList: ["singleTimeList"],
    ongoingCostList: ["ongoingList"],
    ongoingRevenueList: ["ongoingList"],
    unit: ["unit"],
  }),
  mgmtGeneral: { mgmt: childSection("mgmt") },
  mgmt: childrenSections({
    upfrontCostList: ["singleTimeList"],
    ongoingCostList: ["ongoingList"],
  }),
});

// base and relSections for that matter?

// organize the types
// make the child types simpler
// make two versions of ChildType
// fix the lists
// get rid of the tableStore sections
// make a store section on the frontEnd with children analogous to the db sections

export type ChildSections = typeof childSections;
export type SectionChildProps<PN extends keyof GeneralChildSection> = {
  [SN in keyof ChildSections]: {
    [CN in keyof ChildSections[SN]]: ChildSections[SN][CN][PN &
      keyof ChildSections[SN][CN]];
  };
};
