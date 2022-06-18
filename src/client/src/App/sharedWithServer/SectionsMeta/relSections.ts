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
import { LeftRightVarbInfos, relVarb } from "./relSections/rel/relVarb";
import { RelVarbs } from "./relSections/rel/relVarbs";
import { relDealStuff } from "./relSections/relDealStuff";
import { relFinancing } from "./relSections/relFinancing";
import { preMgmtGeneral } from "./relSections/relMgmtGeneral";
import { relPropertyGeneral } from "./relSections/relPropertyGeneral";
import { preUserLists } from "./relSections/relUserLists";

export function makeRelSections() {
  return {
    fe: {
      ...rel.section.sectionTableNext(
        "propertyTable",
        "Property Table",
        "property"
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
        {
          _typeUniformity: rel.varb.string(),
        },
        {
          childNames: ["table"],
        } as const
      ),
      ...rel.section.sectionTableNext("analysisTable", "Deal Table", "deal"),
      ...rel.section.sectionTableNext("loanTable", "Loan Table", "loan"),
      ...rel.section.sectionTableNext("mgmtTable", "Management Table", "mgmt"),
      ...relSection.base(
        "both",
        "omniParent",
        "Parent of All",
        {
          _typeUniformity: rel.varb.string(),
        } as RelVarbs<ContextName, "main">,
        {
          childNames: Arr.exclude(baseNameArrs.fe.all, ["main"]),
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
            "propertyTable",
            "loanTable",
            "mgmtTable",
            "analysisTable",

            "userVarbList",
            "userSingleList",
            "userOngoingList",
            "userOutputList",

            "omniParent",
          ] as const,
        }
      ),
      ...relSection.outputList("dealOutputList", {
        fullIndexName: "userOutputList",
      }),
      ...relSection.outputList("userOutputList", {
        arrStoreName: "userOutputList",
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
        fullIndexName: "userSingleList",
      }),
      ...rel.section.singleTimeList("upfrontRevenueList", "Upfront Revenue", {
        fullIndexName: "userSingleList",
      }),

      ...rel.section.ongoingList("ongoingCostList", "Ongoing Costs", {
        fullIndexName: "userOngoingList",
      }),
      ...rel.section.ongoingList("ongoingRevenueList", "Ongoing Revenue", {
        fullIndexName: "userOngoingList",
      }),

      // savable sections and their children
      ...preUserLists,
      ...relPropertyGeneral,
      ...relFinancing,
      ...preMgmtGeneral,
      ...relDealStuff,
      ...relSection.base("both", "final", "Final Calculations", {
        totalInvestment: rel.varb.leftRightPropFn(
          "Upfront investment",
          "simpleSubtract",
          rel.varbInfo.specifiers("static", [
            ["final", "upfrontExpenses"],
            ["final", "upfrontRevenue"],
          ]) as LeftRightVarbInfos,
          { startAdornment: "$" }
        ),
        cashFlowMonthly: rel.varb.leftRightPropFn(
          "Monthly cash flow",
          "simpleSubtract",
          rel.varbInfo.specifiers("static", [
            ["final", "revenueMonthly"],
            ["final", "expensesMonthly"],
          ]) as LeftRightVarbInfos,
          rel.adorn.moneyMonth
        ),
        cashFlowYearly: rel.varb.leftRightPropFn(
          "Annual cash flow",
          "simpleSubtract",
          rel.varbInfo.specifiers("static", [
            ["final", "revenueYearly"],
            ["final", "expensesYearly"],
          ]) as LeftRightVarbInfos,
          rel.adorn.moneyYear
        ),
        cashFlowOngoingSwitch: rel.varb.string({
          initValue: "yearly",
          dbInitValue: "yearly",
        }),
        roiMonthly: rel.varb.leftRightPropFn(
          "Monthly ROI",
          "divideToPercent",
          rel.varbInfo.specifiers("static", [
            ["final", "cashFlowMonthly"],
            ["final", "totalInvestment"],
          ]) as LeftRightVarbInfos,
          { endAdornment: "%", unit: "percent" }
        ),
        roiYearly: rel.varb.leftRightPropFn(
          "Annual ROI",
          "divideToPercent",
          rel.varbInfo.specifiers("static", [
            ["final", "cashFlowYearly"],
            ["final", "totalInvestment"],
          ]) as LeftRightVarbInfos,
          { endAdornment: "%", unit: "percent" }
        ),
        roiOngoingSwitch: rel.varb.string({
          initValue: "yearly",
          dbInitValue: "yearly",
        }),
        upfrontExpensesSum: rel.varb.sumNums(
          "Sum of upfront expenses",
          rel.varbInfo.specifiers("static", [
            ["propertyGeneral", "upfrontExpenses"],
            ["mgmtGeneral", "upfrontExpenses"],
            ["financing", "downPaymentDollars"],
            ["financing", "closingCosts"],
            ["financing", "mortInsUpfront"],
          ]),
          { startAdornment: "$" }
        ),
        upfrontExpenses: rel.varb.leftRightPropFn(
          "Total upfront expenses",
          "simpleSubtract",
          rel.varbInfo.specifiers("static", [
            ["final", "upfrontExpensesSum"],
            ["financing", "wrappedInLoan"],
          ]) as LeftRightVarbInfos,
          { startAdornment: "$" }
        ),
        upfrontRevenue: rel.varb.sumNums(
          "Upfront revenue",
          [
            rel.varbInfo.relative(
              "propertyGeneral",
              "upfrontRevenue",
              "static"
            ),
          ],
          { startAdornment: "$" }
        ),
        ...rel.varbs.ongoingSumNums(
          "expenses",
          "Ongoing expenses",
          rel.varbInfo.statics([
            ["propertyGeneral", "ongoingExpenses"],
            ["mgmtGeneral", "ongoingExpenses"],
            ["financing", "piti"],
          ])
        ),
        ...rel.varbs.ongoingSumNums(
          "revenue",
          "Ongoing revenue",
          [rel.varbInfo.static("propertyGeneral", "ongoingRevenue")],
          { shared: { startAdornment: "$" }, switchInit: "monthly" }
        ),
      }),
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
