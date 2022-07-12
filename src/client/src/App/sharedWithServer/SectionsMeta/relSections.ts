import { ApiAccessStatus, SimpleSectionName } from "./baseSections";
import { relVarb, relVarbS } from "./relSectionsUtils/rel/relVarb";
import {
  GeneralRelSection,
  GenericRelSection,
  relSection,
} from "./relSectionsUtils/relSection";
import { RelVarbs, relVarbsS } from "./relSectionsUtils/relVarbs";
import { dealRelVarbs } from "./relSectionsUtils/relVarbs/dealRelVarbs";
import {
  financingRelVarbs,
  loanRelVarbs,
} from "./relSectionsUtils/relVarbs/financingRelVarbs";
import { mgmtRelVarbs } from "./relSectionsUtils/relVarbs/mgmtRelVarbs";
import { propertyRelVarbs } from "./relSectionsUtils/relVarbs/propertyRelVarbs";
import { userVarbItemRelVarbs } from "./relSectionsUtils/relVarbs/userVarbItemRelVarbs";

type GenericRelSections = {
  [SN in SimpleSectionName]: GenericRelSection<SN>;
};

function relSectionsFilter<RS extends GenericRelSections>(relSections: RS): RS {
  return relSections;
}

const savableSectionStringVarbNames = [
  "title",
  "dateTimeFirstSaved",
  "dateTimeLastSaved",
] as const;

export function makeRelSections() {
  return relSectionsFilter({
    root: relSection("Root", { _typeUniformity: relVarb("string") }),
    omniParent: relSection("Parent of all", {
      _typeUniformity: relVarb("string"),
    }),
    main: relSection("main", { _typeUniformity: relVarb("string") }),
    feStore: relSection("feStore", { _typeUniformity: relVarb("string") }),
    dbStore: relSection("dbStore", { _typeUniformity: relVarb("string") }),
    user: relSection(
      "User",
      {
        email: relVarb("string", { displayName: "Email" }),
        userName: relVarb("string", { displayName: "Name" }),
        apiAccessStatus: relVarb("string", {
          displayName: "Api Access Status",
          initValue: "basicStorage" as ApiAccessStatus,
        }),
      },
      { dbIndexStoreName: "user" }
    ),
    serverOnlyUser: relSection("serverOnlyUser", {
      encryptedPassword: relVarb("string"),
      emailAsSubmitted: relVarb("string"),
    }),
    login: relSection("login", {
      email: relVarb("string", { displayName: "Email" }),
      password: relVarb("string", { displayName: "Password" }),
    }),
    register: relSection("Register Form", {
      email: relVarb("string", { displayName: "Email" }),
      userName: relVarb("string", { displayName: "Name" }),
      password: relVarb("string", { displayName: "Password" }),
    }),
    table: relSection("Table", { titleFilter: relVarb("string") }),
    tableRow: relSection("Row", {
      title: relVarb("string"),
      compareToggle: relVarb("boolean"),
    }),
    column: relSection("Column", relVarbsS.varbInfo()),
    cell: relSection("Cell", {
      ...relVarbsS.varbInfo(),
      value: relVarbS.numObj("Table cell value"),
    }),
    outputList: relSection(
      "Output List",
      { title: relVarb("string") },
      {
        feFullIndexStoreName: "outputListMain",
        dbIndexStoreName: "outputListMain",
      }
    ),
    output: relSection("Output", relVarbsS.varbInfo()),
    singleTimeList: relSection("List", relVarbsS.singleTimeList(), {
      varbListItem: "singleTimeItem",
      feFullIndexStoreName: "singleTimeListMain",
      dbIndexStoreName: "singleTimeListMain",
    }),
    singleTimeItem: relSection("List Item", relVarbsS.singleTimeItem()),
    ongoingList: relSection("List", relVarbsS.ongoingList(), {
      varbListItem: "ongoingItem",
      feFullIndexStoreName: "ongoingListMain",
      dbIndexStoreName: "ongoingListMain",
    }),
    ongoingItem: relSection("List Item", relVarbsS.ongoingItem()),
    userVarbList: relSection(
      "Variable List",
      {
        ...relVarbsS.savableSection,
        defaultValueSwitch: relVarb("string", {
          initValue: "labeledEquation",
        } as const),
      },
      {
        feFullIndexStoreName: "userVarbListMain",
        dbIndexStoreName: "userVarbListMain",
        varbListItem: "userVarbItem",
      }
    ),
    userVarbItem: relSection("User Variable", userVarbItemRelVarbs),
    conditionalRow: relSection("Conditional Row", {
      level: relVarb("number"),
      type: relVarb("string", { initValue: "if" }),
      // if
      left: relVarb("numObj"),
      operator: relVarb("string", { initValue: "===" }),
      rightList: relVarb("stringArray"),
      rightValue: relVarb("numObj"),
      // then
      then: relVarb("numObj"),
    }),
    //     { type: "if", level: 0 },
    //     { type: "then", level: 0 },
    //     { type: "or else", level: 0 },

    deal: relSection("deal", dealRelVarbs(), {
      feTableIndexStoreName: "dealTable",
      dbIndexStoreName: "dealMain",
    } as const),
    financing: relSection("Financing", financingRelVarbs),
    loan: relSection("Loan", loanRelVarbs(), {
      feTableIndexStoreName: "loanTable",
      dbIndexStoreName: "loanMain",
    }),
    propertyGeneral: relSection("Property", {
      ...relVarbsS.sumSection("property", propertyRelVarbs()),
      ...relVarbsS.sectionStrings(
        "property",
        propertyRelVarbs(),
        savableSectionStringVarbNames
      ),
    }),
    property: relSection("Property", propertyRelVarbs(), {
      feTableIndexStoreName: "propertyTable",
      dbIndexStoreName: "propertyMain",
    }),
    unit: relSection("Unit", {
      one: relVarbS.numObj("Unit", {
        updateFnName: "one",
        initNumber: 1,
      }),
      numBedrooms: relVarbS.calcVarb("BRs"),
      ...relVarbsS.timeMoneyInput("targetRent", "Rent"),
    } as RelVarbs<"unit">),
    mgmtGeneral: relSection("Management", {
      ...relVarbsS.sumSection("mgmt", { ...mgmtRelVarbs() }),
      ...relVarbsS.sectionStrings(
        "mgmt",
        { ...mgmtRelVarbs() },
        savableSectionStringVarbNames
      ),
    }),
    mgmt: relSection("Management", mgmtRelVarbs(), {
      feTableIndexStoreName: "mgmtTable",
      dbIndexStoreName: "mgmtMain",
    }),
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
