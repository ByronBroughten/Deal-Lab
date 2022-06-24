import { Arr } from "../utils/Arr";
import {
  MergeUnionObj,
  MergeUnionObjNonNullable,
} from "../utils/types/mergeUnionObj";
import {
  ApiAccessStatus,
  ContextName,
  SimpleSectionName,
} from "./baseSections";
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
    fe: {
      ...rel.section.base(
        "fe" as ContextName,
        "root",
        "Root",
        { _typeUniformity: rel.varb.string() },
        { childNames: ["omniParent", "main"] as const }
      ),
      ...relSection.base(
        "both",
        "omniParent",
        "Parent of All",
        {
          _typeUniformity: rel.varb.string(),
        } as RelVarbs<ContextName, "main">,
        {
          childNames: Arr.exclude(baseNameArrs.fe.all, [
            "root",
            "omniParent",
          ] as const),
        }
      ),
      ...relSection.base(
        "both",
        "main",
        "Main",
        {
          _typeUniformity: rel.varb.string(),
        } as RelVarbs<ContextName, "main">,
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
        "fe" as ContextName,
        "table",
        "Table",
        { titleFilter: relVarb.string() } as RelVarbs<ContextName, "table">,
        {
          childNames: ["column", "tableRow"] as const,
        }
      ),
      ...relSection.base(
        "both",
        "propertyTableStore",
        "Property Table Store",
        { _typeUniformity: rel.varb.string() },
        { childNames: ["table"] } as const
      ),
      ...relSection.base(
        "both",
        "loanTableStore",
        "Loan Table Store",
        { _typeUniformity: rel.varb.string() },
        { childNames: ["table"] } as const
      ),
      ...relSection.base(
        "both",
        "mgmtTableStore",
        "Mgmt Table Store",
        { _typeUniformity: rel.varb.string() },
        { childNames: ["table"] } as const
      ),
      ...relSection.base(
        "both",
        "dealTableStore",
        "Deal Table Store",
        { _typeUniformity: rel.varb.string() },
        { childNames: ["table"] } as const
      ),
      ...relSection.base(
        "both",
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
      ...relSection.base("both", "column", "Column", {
        ...rel.varbs.varbInfo(),
      }),
      ...relSection.base("both", "cell", "Cell", {
        ...rel.varbs.varbInfo(),
        value: rel.varb.numObj("cell"),
      }),

      // singleTimeItem and ongoingItem are for additiveLists
      ...relSection.base(
        "both",
        "singleTimeItem",
        "List Item",
        rel.varbs.singleTimeItem()
      ),
      ...relSection.base(
        "both",
        "ongoingItem",
        "List Item",
        rel.varbs.ongoingItem()
      ),
      ...relSection.base("both", "user", "User", {
        email: rel.varb.string({ displayName: "Email" }),
        userName: rel.varb.string({ displayName: "Name" }),
        apiAccessStatus: relVarb.string({
          displayName: "Api Access Status",
          dbInitValue: "basicStorage" as ApiAccessStatus,
        }),
      }),
      ...relSection.base("both", "serverOnlyUser", "User", {
        encryptedPassword: rel.varb.string(),
        emailAsSubmitted: rel.varb.string(),
      }),
      ...relSection.base("both", "login", "Login Form", {
        email: rel.varb.string({ displayName: "Email" }),
        password: rel.varb.string({ displayName: "Password" }),
      }),
      ...relSection.base("both", "register", "Register Form", {
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
    },
    get db() {
      return this.fe;
    },
  } as const;
}
export type RelSections = ReturnType<typeof makeRelSections>;

type PreGeneralRelSections = {
  [SC in ContextName]: {
    [SN in SimpleSectionName]: GeneralRelSection;
  };
};

export type RelSectionName<SC extends ContextName = ContextName> =
  keyof RelSections[SC];

export type GeneralRelSections = {
  [SC in ContextName]: MergeUnionObj<PreGeneralRelSections[ContextName]>;
};
export type FullGeneralRelSections = {
  [SC in ContextName]: MergeUnionObjNonNullable<
    PreGeneralRelSections[ContextName]
  >;
};

export const relSections = makeRelSections();
const _testRelSections = <RS extends GeneralRelSections>(_: RS): void =>
  undefined;
_testRelSections(relSections);
