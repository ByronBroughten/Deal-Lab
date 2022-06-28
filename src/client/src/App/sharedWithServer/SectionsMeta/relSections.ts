import { ApiAccessStatus, SimpleSectionName } from "./baseSections";
import { rel } from "./relSections/rel";
import { relChild, relChildren } from "./relSections/rel/relChild";
import {
  GeneralRelSection,
  GenericRelSection,
  relSection,
  relSectionS,
} from "./relSections/rel/relSection";
import { relVarbS } from "./relSections/rel/relVarb";
import { relVarbsS } from "./relSections/rel/relVarbs";
import { dealRelVarbs } from "./relSections/relDealStuff";
import { financingRelVarbs, loanRelVarbs } from "./relSections/relFinancing";
import { preMgmtGeneral } from "./relSections/relMgmtGeneral";
import { relOmniParentChildren } from "./relSections/relOmniParent";
import { relPropertyGeneral } from "./relSections/relPropertyGeneral";
import { userVarbItemVarbs } from "./relSections/relUserLists";

// Two objectives
// Specify that the four lists are lists
// Specify what their list items are

// I can do this either by calling each of their only child, "listItem"
// This would be the simplest solution
// I change the childNames and I use the childNames

// Or I can give them a relParameter called "listItem" that specifies
// the name of their child that is a listItem
// This would be the most de-coupley solution
// I would have to make the "listItem" parameter getable from sectionMeta
// For type safety, eventually I would want  to specify that the parameter points
// to the child's name (even though for now there is only one child)

// this isn't too bad.

type GenericRelSections = {
  [SN in SimpleSectionName]: GenericRelSection<SN>;
};

function relSectionsFilter<RS extends GenericRelSections>(relSections: RS): RS {
  return relSections;
}

export function makeRelSections() {
  return relSectionsFilter({
    root: relSection(
      "Root",
      { _typeUniformity: relVarbS.string() },
      {
        children: relChildren({
          omniParent: ["omniParent"],
          main: ["main"],
        }),
      }
    ),
    omniParent: relSection(
      "Parent of all",
      { _typeUniformity: relVarbS.string() },
      { children: relOmniParentChildren }
    ),
    main: relSection(
      "main",
      { _typeUniformity: relVarbS.string() },
      {
        children: relChildren({
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
      }
    ),

    user: relSection("User", {
      email: relVarbS.string({ displayName: "Email" }),
      userName: relVarbS.string({ displayName: "Name" }),
      apiAccessStatus: relVarbS.string({
        displayName: "Api Access Status",
        initValue: "basicStorage" as ApiAccessStatus,
      }),
    }),
    serverOnlyUser: relSection("serverOnlyUser", {
      encryptedPassword: relVarbS.string(),
      emailAsSubmitted: relVarbS.string(),
    }),
    login: relSection("login", {
      email: relVarbS.string({ displayName: "Email" }),
      password: relVarbS.string({ displayName: "Password" }),
    }),
    register: relSection("Register Form", {
      email: relVarbS.string({ displayName: "Email" }),
      userName: relVarbS.string({ displayName: "Name" }),
      password: relVarbS.string({ displayName: "Password" }),
    }),

    table: relSection(
      "Table",
      { titleFilter: relVarbS.string() },
      {
        children: relChildren({
          column: ["column"],
          tableRow: ["tableRow"],
        }),
      }
    ),
    tableRow: relSection(
      "Row",
      {
        title: relVarbS.string(),
        compareToggle: relVarbS.type("boolean"),
      },
      { children: { cell: relChild("cell") } }
    ),
    column: relSection("Column", relVarbsS.varbInfo()),
    ...relSectionS.base("cell", "Cell", {
      ...rel.varbs.varbInfo(),
      value: relVarbS.numObj("Table cell value"),
    }),

    outputList: relSection(
      "Output List",
      { title: relVarbS.string() },
      { children: { output: relChild("output") } }
    ),
    output: relSection("Output", relVarbsS.varbInfo()),
    singleTimeList: relSection("List", relVarbsS.singleTimeList(), {
      fullIndexName: "singleTimeList",
      varbListItem: "singleTimeItem",
      children: {
        singleTimeItem: relChild("singleTimeItem"),
      },
    }),
    singleTimeItem: relSection("List Item", relVarbsS.singleTimeItem()),
    ongoingList: relSection("List", relVarbsS.ongoingList(), {
      fullIndexName: "ongoingList",
      varbListItem: "ongoingItem",
      children: {
        ongoingItem: relChild("ongoingItem", {
          isListItem: true,
        }),
      },
    }),
    ongoingItem: relSection("List Item", relVarbsS.ongoingItem()),
    userVarbList: relSection(
      "Variable List",
      {
        ...relVarbsS.savableSection,
        defaultValueSwitch: relVarbS.string({
          initValue: "labeledEquation",
        } as const),
      },
      {
        fullIndexName: "userVarbList",
        varbListItem: "ongoingItem",
        children: { userVarbItem: { sectionName: "userVarbItem" } },
      }
    ),
    userVarbItem: relSection("User Variable", userVarbItemVarbs, {
      children: { conditionalRow: relChild("conditionalRow") },
    }),
    conditionalRow: relSection("Conditional Row", {
      level: rel.varb.type("number"),
      type: rel.varb.string({ initValue: "if" }),
      // if
      left: rel.varb.type("numObj"),
      operator: rel.varb.string({ initValue: "===" }),
      rightList: rel.varb.type("stringArray"),
      rightValue: rel.varb.type("numObj"),
      // then
      then: rel.varb.type("numObj"),
    }),
    //     { type: "if", level: 0 },
    //     { type: "then", level: 0 },
    //     { type: "or else", level: 0 },

    deal: relSection("deal", dealRelVarbs(), {
      tableStoreName: "dealTableStore",
      rowIndexName: "deal",
      children: relChildren({
        propertyGeneral: ["propertyGeneral"],
        financing: ["financing"],
        mgmtGeneral: ["mgmtGeneral"],
        dealOutputList: ["outputList"],
      }),
    }),
    financing: relSection("Financing", financingRelVarbs, {
      children: { loan: relChild("loan") },
    }),
    loan: relSection("Loan", loanRelVarbs(), {
      tableStoreName: "loanTableStore",
      rowIndexName: "loan",
      children: relChildren({
        closingCostList: ["singleTimeList"],
        wrappedInLoanList: ["singleTimeList"],
      }),
    }),
    ...relSectionS.base(
      "propertyTableStore",
      "Property Table Store",
      { _typeUniformity: relVarbS.string() },
      { children: { table: relChild("table") } }
    ),
    ...relSectionS.base(
      "loanTableStore",
      "Loan Table Store",
      { _typeUniformity: relVarbS.string() },
      { children: { table: relChild("table") } } as const
    ),
    ...relSectionS.base(
      "mgmtTableStore",
      "Mgmt Table Store",
      { _typeUniformity: relVarbS.string() },
      { children: { table: relChild("table") } } as const
    ),
    ...relSectionS.base(
      "dealTableStore",
      "Deal Table Store",
      { _typeUniformity: relVarbS.string() },
      { children: { table: relChild("table") } } as const
    ),

    // savable sections and their children
    ...relPropertyGeneral,
    ...preMgmtGeneral,
  });
}

export const relSections = makeRelSections();
export type RelSections = typeof relSections;
type GeneralRelSections = {
  [SN in SimpleSectionName]: GeneralRelSection;
};

const _testRelSections = <RS extends GeneralRelSections>(_: RS): void =>
  undefined;
_testRelSections(relSections);
