import { Arr } from "../utils/Arr";
import { ApiAccessStatus, SimpleSectionName } from "./baseSections";
import { baseNameArrs } from "./baseSectionTypes/baseNameArrs";
import { rel } from "./relSections/rel";
import { GeneralRelSection, relSection } from "./relSections/rel/relSection";
import { relVarb } from "./relSections/rel/relVarb";
import { RelVarbs } from "./relSections/rel/relVarbs";
import { relDealStuff } from "./relSections/relDealStuff";
import { relFinancing } from "./relSections/relFinancing";
import { preMgmtGeneral } from "./relSections/relMgmtGeneral";
import { relPropertyGeneral } from "./relSections/relPropertyGeneral";
import { preUserLists } from "./relSections/relUserLists";

export function makeRelSections() {
  return {
    ...rel.section.base(
      "root",
      "Root",
      { _typeUniformity: rel.varb.string() },
      { childNames: ["omniParent", "main"] as const }
    ),
    ...relSection.base(
      "omniParent",
      "Parent of All",
      {
        _typeUniformity: rel.varb.string(),
      } as RelVarbs<"main">,
      {
        childNames: Arr.exclude(baseNameArrs.fe.all, [
          "root",
          "omniParent",
        ] as const),
      }
    ),
    ...relSection.base(
      "main",
      "Main",
      {
        _typeUniformity: rel.varb.string(),
      } as RelVarbs<"main">,
      {
        childNames: [
          "user",
          "serverOnlyUser",
          "login",
          "register",

          "deal",

          "propertyTableStore",
          "loanTableStore",
          "mgmtTableStore",
          "dealTableStore",

          "userVarbList",
          "userSingleList",
          "userOngoingList",
          "userOutputList",

          "varbList",
          "singleTimeList",
          "ongoingList",
          "outputList",
        ] as const,
      }
    ),

    ...rel.section.base(
      "table",
      "Table",
      { titleFilter: relVarb.string() } as RelVarbs<"table">,
      {
        childNames: ["column", "tableRow"] as const,
      }
    ),
    ...relSection.base(
      "propertyTableStore",
      "Property Table Store",
      { _typeUniformity: rel.varb.string() },
      { childNames: ["table"] } as const
    ),
    ...relSection.base(
      "loanTableStore",
      "Loan Table Store",
      { _typeUniformity: rel.varb.string() },
      { childNames: ["table"] } as const
    ),
    ...relSection.base(
      "mgmtTableStore",
      "Mgmt Table Store",
      { _typeUniformity: rel.varb.string() },
      { childNames: ["table"] } as const
    ),
    ...relSection.base(
      "dealTableStore",
      "Deal Table Store",
      { _typeUniformity: rel.varb.string() },
      { childNames: ["table"] } as const
    ),
    ...relSection.base(
      "outputList",
      "Output List",
      {
        title: rel.varb.string(),
      },
      { childNames: ["output"] as const }
    ),

    ...relSection.outputList("dealOutputList", {
      fullIndexName: "outputList",
    }),
    ...relSection.outputList("userOutputList", {
      arrStoreName: "outputList",
    }),

    // these are for tables
    ...relSection.rowIndex("tableRow", "Row"),
    ...relSection.base("column", "Column", {
      ...rel.varbs.varbInfo(),
    }),
    ...relSection.base("cell", "Cell", {
      ...rel.varbs.varbInfo(),
      value: rel.varb.numObj("cell"),
    }),

    // singleTimeItem and ongoingItem are for additiveLists
    ...relSection.base(
      "singleTimeItem",
      "List Item",
      rel.varbs.singleTimeItem()
    ),
    ...relSection.base("ongoingItem", "List Item", rel.varbs.ongoingItem()),
    ...relSection.base("user", "User", {
      email: rel.varb.string({ displayName: "Email" }),
      userName: rel.varb.string({ displayName: "Name" }),
      apiAccessStatus: relVarb.string({
        displayName: "Api Access Status",
        initValue: "basicStorage" as ApiAccessStatus,
      }),
    }),
    ...relSection.base("serverOnlyUser", "User", {
      encryptedPassword: rel.varb.string(),
      emailAsSubmitted: rel.varb.string(),
    }),
    ...relSection.base("login", "Login Form", {
      email: rel.varb.string({ displayName: "Email" }),
      password: rel.varb.string({ displayName: "Password" }),
    }),
    ...relSection.base("register", "Register Form", {
      email: rel.varb.string({ displayName: "Email" }),
      userName: rel.varb.string({ displayName: "Name" }),
      password: rel.varb.string({ displayName: "Password" }),
    }),

    // these are shared between property and mgmt
    ...rel.section.singleTimeList("upfrontCostList", "Upfront Costs", {
      fullIndexName: "singleTimeList",
    }),
    ...rel.section.singleTimeList("upfrontRevenueList", "Upfront Revenue", {
      fullIndexName: "singleTimeList",
    }),
    ...rel.section.ongoingList("ongoingCostList", "Ongoing Costs", {
      fullIndexName: "ongoingList",
    }),
    ...rel.section.ongoingList("ongoingRevenueList", "Ongoing Revenue", {
      fullIndexName: "ongoingList",
    }),
    ...rel.section.ongoingList("ongoingCostList", "Ongoing Costs", {
      fullIndexName: "ongoingList",
    }),

    ...rel.section.ongoingList("ongoingList", "Ongoing Costs", {
      fullIndexName: "ongoingList",
    }),
    ...rel.section.singleTimeList("singleTimeList", "Upfront Revenue", {
      fullIndexName: "singleTimeList",
    }),

    // savable sections and their children
    ...preUserLists,
    ...relPropertyGeneral,
    ...relFinancing,
    ...preMgmtGeneral,
    ...relDealStuff,
  } as const;
}

export type RelSections = ReturnType<typeof makeRelSections>;
type GeneralRelSections = {
  [SN in SimpleSectionName]: GeneralRelSection;
};

export const relSections = makeRelSections();
const _testRelSections = <RS extends GeneralRelSections>(_: RS): void =>
  undefined;
_testRelSections(relSections);
