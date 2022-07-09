import { ApiAccessStatus, SimpleSectionName } from "./baseSections";
import { rel } from "./relSectionsUtils/rel";
import { relVarbS } from "./relSectionsUtils/rel/relVarb";
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
    root: relSection("Root", { _typeUniformity: relVarbS.string() }),
    omniParent: relSection("Parent of all", {
      _typeUniformity: relVarbS.string(),
    }),
    main: relSection("main", { _typeUniformity: relVarbS.string() }),

    user: relSection(
      "User",
      {
        email: relVarbS.string({ displayName: "Email" }),
        userName: relVarbS.string({ displayName: "Name" }),
        apiAccessStatus: relVarbS.string({
          displayName: "Api Access Status",
          initValue: "basicStorage" as ApiAccessStatus,
        }),
      },
      {
        arrStoreName: "user",
      }
    ),
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
    table: relSection("Table", { titleFilter: relVarbS.string() }),
    tableRow: relSection("Row", {
      title: relVarbS.string(),
      compareToggle: relVarbS.type("boolean"),
    }),
    column: relSection("Column", relVarbsS.varbInfo()),
    cell: relSection("Cell", {
      ...relVarbsS.varbInfo(),
      value: relVarbS.numObj("Table cell value"),
    }),
    outputList: relSection("Output List", { title: relVarbS.string() }),
    output: relSection("Output", relVarbsS.varbInfo()),
    singleTimeList: relSection("List", relVarbsS.singleTimeList(), {
      fullIndexName: "singleTimeList",
      varbListItem: "singleTimeItem",
    }),
    singleTimeItem: relSection("List Item", relVarbsS.singleTimeItem()),
    ongoingList: relSection("List", relVarbsS.ongoingList(), {
      fullIndexName: "ongoingList",
      varbListItem: "ongoingItem",
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
        varbListItem: "userVarbItem",
      }
    ),
    userVarbItem: relSection("User Variable", userVarbItemRelVarbs),
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
    } as const),
    financing: relSection("Financing", financingRelVarbs),
    loan: relSection("Loan", loanRelVarbs(), {
      tableStoreName: "loanTableStore",
      rowIndexName: "loan",
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
      tableStoreName: "propertyTableStore",
      rowIndexName: "property",
    }),
    unit: relSection("Unit", {
      one: rel.varb.numObj("Unit", {
        updateFnName: "one",
        initNumber: 1,
      }),
      numBedrooms: rel.varb.calcVarb("BRs"),
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
      tableStoreName: "mgmtTableStore",
      rowIndexName: "mgmt",
    }),

    propertyTableStore: relSection("Property Table Store", {
      _typeUniformity: relVarbS.string(),
    }),
    loanTableStore: relSection("Loan Table Store", {
      _typeUniformity: relVarbS.string(),
    }),
    mgmtTableStore: relSection("Management Table Store", {
      _typeUniformity: relVarbS.string(),
    }),
    dealTableStore: relSection("Deal Table Store", {
      _typeUniformity: relVarbS.string(),
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
