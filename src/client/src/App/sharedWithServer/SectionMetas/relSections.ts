import {
  MergeUnionObj,
  MergeUnionObjNonNullable,
} from "../utils/types/mergeUnionObj";
import { ContextName, SimpleSectionName } from "./baseSections";
import { rel } from "./relSections/rel";
import { GeneralRelSection, relSection } from "./relSections/rel/relSection";
import { LeftRightVarbInfos, relVarb } from "./relSections/rel/relVarb";
import { RelVarbs } from "./relSections/rel/relVarbs";
import { relAnalysisStuff } from "./relSections/relAnalysisStuff";
import { relFinancing } from "./relSections/relFinancing";
import { preMgmtGeneral } from "./relSections/relMgmtGeneral";
import { prePropertyGeneral } from "./relSections/relPropertyGeneral";
import { preUserLists } from "./relSections/relUserLists";

export function makeRelSections() {
  return {
    fe: {
      ...rel.section.sectionTableNext(
        "propertyTableNext",
        "Property Table",
        "propertyIndexNext"
      ),
      ...rel.section.sectionTableNext(
        "loanTableNext",
        "Loan Table",
        "loanIndexNext"
      ),
      ...rel.section.sectionTableNext(
        "mgmtTableNext",
        "Management Table",
        "mgmtIndexNext"
      ),
      ...rel.section.sectionTableNext(
        "analysisTableNext",
        "Analysis Table",
        "analysisIndexNext"
      ),

      ...relSection.base(
        "both",
        "main",
        "Main",
        {
          // _placeholder: rel.varb.string()
        } as RelVarbs<ContextName, "main">,
        {
          childNames: [
            "user",
            "login",
            "register",

            "propertyIndexNext",
            "loanIndexNext",
            "mgmtIndexNext",
            "analysisIndexNext",

            "propertyTableNext",
            "loanTableNext",
            "mgmtTableNext",
            "analysisTableNext",

            "userVarbList",
            "userSingleList",
            "userOngoingList",

            "analysis",
            "analysisIndex",
            "analysisTable",
            "outputListDefault",
          ] as const,
        }
      ),
      ...relSection.outputList("dealOutputList", {
        defaultStoreName: "outputListDefault",
        fullIndexName: "userOutputList",
      }),
      ...relSection.outputList("outputListDefault"),
      ...relSection.outputList("userOutputList", {
        arrStoreName: "userOutputList",
      }),
      ...relSection.base(
        "both",
        "outputListDefault",
        "Output List",
        { title: rel.varb.string() },
        { childNames: ["output"] as const }
      ),

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
          dbInitValue: "basicStorage",
        }),
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
        indexStoreName: "userSingleList",
        fullIndexName: "userSingleList",
      }),
      ...rel.section.singleTimeList("upfrontRevenueList", "Upfront Revenue", {
        indexStoreName: "userSingleList",
        fullIndexName: "userSingleList",
      }),

      ...rel.section.ongoingList("ongoingCostList", "Ongoing Costs", {
        indexStoreName: "userOngoingList",
        fullIndexName: "userOngoingList",
      }),
      ...rel.section.ongoingList("ongoingRevenueList", "Ongoing Revenue", {
        indexStoreName: "userOngoingList",
        fullIndexName: "userOngoingList",
      }),

      // savable sections and their children
      ...preUserLists,
      ...prePropertyGeneral,
      ...relFinancing,
      ...preMgmtGeneral,
      ...relAnalysisStuff,

      ...relSection.base(
        "both",
        "totalInsAndOuts",
        "Total Incomes and Expenses",
        {
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
              ["totalInsAndOuts", "upfrontExpensesSum"],
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
        }
      ),
      //
      ...relSection.base("both", "final", "Final Calculations", {
        totalInvestment: rel.varb.leftRightPropFn(
          "Upfront investment",
          "simpleSubtract",
          rel.varbInfo.specifiers("static", [
            ["totalInsAndOuts", "upfrontExpenses"],
            ["totalInsAndOuts", "upfrontRevenue"],
          ]) as LeftRightVarbInfos,
          { startAdornment: "$" }
        ),
        cashFlowMonthly: rel.varb.leftRightPropFn(
          "Monthly cash flow",
          "simpleSubtract",
          rel.varbInfo.specifiers("static", [
            ["totalInsAndOuts", "revenueMonthly"],
            ["totalInsAndOuts", "expensesMonthly"],
          ]) as LeftRightVarbInfos,
          rel.adorn.moneyMonth
        ),
        cashFlowYearly: rel.varb.leftRightPropFn(
          "Annual cash flow",
          "simpleSubtract",
          rel.varbInfo.specifiers("static", [
            ["totalInsAndOuts", "revenueYearly"],
            ["totalInsAndOuts", "expensesYearly"],
          ]) as LeftRightVarbInfos,
          rel.adorn.moneyYear
        ),
        cashFlowOngoingSwitch: rel.varb.string({ initValue: "yearly" }),
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
        roiOngoingSwitch: rel.varb.string({ initValue: "yearly" }),
      }),
    },
    get db() {
      return {
        ...this.fe,
        propertyIndex: this.fe.property,
        loanIndex: this.fe.loan,
        mgmtIndex: this.fe.mgmt,
        analysisIndex: this.fe.analysis,
        ...rel.section.base("db", "user", "User", {
          ...this.fe.user.relVarbs,
          encryptedPassword: rel.varb.string(),
          emailAsSubmitted: rel.varb.string(),
        }),
      } as const;
    },
  } as const;
}
export type RelSections = ReturnType<typeof makeRelSections>;

type PreGeneralRelSections = {
  [SC in ContextName]: {
    [SN in SimpleSectionName<SC>]: GeneralRelSection;
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
