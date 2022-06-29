import { SimpleSectionName, simpleSectionNames } from "./baseSections";
import { relOmniParentChildren } from "./childSectionsUtils/omniParentChildren";
import { GeneralRelChild, relChild } from "./childSectionsUtils/relChild";
import { relChildren } from "./childSectionsUtils/relChildren";

type Defaults = {
  [SN in SimpleSectionName]: {};
};
const defaults = simpleSectionNames.reduce((defaults, sectionName) => {
  defaults[sectionName] = {};
  return defaults;
}, {} as Defaults);

export type GeneralChildSection = { [key: string]: GeneralRelChild };
type GenericChildSections = {
  [SN in SimpleSectionName]: GeneralChildSection;
};

function checkChildSections<CS extends GenericChildSections>(
  childSections: CS
) {
  return childSections;
}

export const childSections = checkChildSections({
  ...defaults,
  root: relChildren({
    omniParent: ["omniParent"],
    main: ["main"],
  }),
  omniParent: relOmniParentChildren,
  main: relChildren({
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
  table: relChildren({
    column: ["column"],
    tableRow: ["tableRow"],
  }),
  tableRow: { cell: relChild("cell") },
  outputList: { output: relChild("output") },
  singleTimeList: { singleTimeItem: relChild("singleTimeItem") },
  ongoingList: {
    ongoingItem: relChild("ongoingItem", {
      isListItem: true,
    }),
  },
  userVarbList: { userVarbItem: { sectionName: "userVarbItem" } },
  userVarbItem: { conditionalRow: relChild("conditionalRow") },
  deal: relChildren({
    propertyGeneral: ["propertyGeneral"],
    financing: ["financing"],
    mgmtGeneral: ["mgmtGeneral"],
    dealOutputList: ["outputList"],
  }),
  financing: { loan: relChild("loan") },
  loan: {
    closingCostList: relChild("singleTimeList"),
    wrappedInLoanList: relChild("singleTimeList"),
  },

  propertyGeneral: { property: relChild("property") },
  property: relChildren({
    upfrontCostList: ["singleTimeList"],
    upfrontRevenueList: ["singleTimeList"],
    ongoingCostList: ["ongoingList"],
    ongoingRevenueList: ["ongoingList"],
    unit: ["unit"],
  }),
  mgmtGeneral: { mgmt: relChild("mgmt") },
  mgmt: relChildren({
    upfrontCostList: ["singleTimeList"],
    ongoingCostList: ["ongoingList"],
  }),
  propertyTableStore: { table: relChild("table") },
  loanTableStore: { table: relChild("table") },
  mgmtTableStore: { table: relChild("table") },
  dealTableStore: { table: relChild("table") },
});

// base and relSections for that matter?

// organize the types
// make the child types simpler
// make two versions of ChildType
// fix the lists
// get rid of the tableStore sections
// make a store section on the frontEnd with children analogous to the db sections

export type ChildSections = typeof childSections;
export type SectionChildProps<PN extends keyof GeneralRelChild> = {
  [SN in keyof ChildSections]: {
    [CN in keyof ChildSections[SN]]: ChildSections[SN][CN][PN &
      keyof ChildSections[SN][CN]];
  };
};
