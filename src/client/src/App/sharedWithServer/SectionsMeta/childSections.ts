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
  main: childrenSections({
    user: ["user"],
    serverOnlyUser: ["serverOnlyUser"],
    login: ["login"],
    register: ["register"],
    deal: ["deal"],
    propertyTableStore: ["propertyTableStore"],
    loanTableStore: ["loanTableStore"],
    mgmtTableStore: ["mgmtTableStore"],
    dealTableStore: ["dealTableStore"],
    userVarbList: ["userVarbList"],
    userOutputList: ["outputList"],
    userSingleList: ["singleTimeList"],
    userOngoingList: ["ongoingList"],
    singleTimeList: ["singleTimeList"],
    ongoingList: ["ongoingList"],
    outputList: ["outputList"],
  }),
  table: childrenSections({
    column: ["column"],
    tableRow: ["tableRow"],
  }),
  tableRow: { cell: childSection("cell") },
  outputList: { output: childSection("output") },
  singleTimeList: { singleTimeItem: childSection("singleTimeItem") },
  ongoingList: {
    ongoingItem: childSection("ongoingItem", {
      isListItem: true,
    }),
  },
  userVarbList: { userVarbItem: childSection("userVarbItem") },
  userVarbItem: { conditionalRow: childSection("conditionalRow") },
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
  propertyTableStore: { table: childSection("table") },
  loanTableStore: { table: childSection("table") },
  mgmtTableStore: { table: childSection("table") },
  dealTableStore: { table: childSection("table") },
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
