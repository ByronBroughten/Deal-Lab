import { preMgmtGeneral } from "./relSections/relMgmtGeneral";
import { prePropertyGeneral } from "./relSections/relPropertyGeneral";
import { relFinancing } from "./relSections/relFinancing";
import { rel } from "./relSections/rel";
import { preUserLists } from "./relSections/relUserLists";
import { relAnalysisStuff } from "./relSections/relAnalysisStuff";
import {
  RelSection,
  relSection,
  RelSectionOptions,
} from "./relSections/rel/relSection";
import { BaseSections } from "./relSections/baseSectionTypes";
import { RelVarbs } from "./relSections/rel/relVarbs";
import { LeftRightVarbInfos } from "./relSections/rel/relVarb";

export function makeRelSections() {
  return {
    ...relSection.base("main", "Main", {} as RelVarbs<"main">, {
      childSectionNames: [
        "user",
        "login",
        "register",

        "userVarbList",
        "userSingleList",
        "userOngoingList",
        "propertyGeneral",
        "financing",
        "mgmtGeneral",
        "totalInsAndOuts",
        "final",

        "analysis",
        "analysisIndex",
        "analysisTable",
        "analysisDefault",
      ] as const,
    }),

    // these are for tables
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
      emailLower: rel.varb.string(),
      userName: rel.varb.string({ displayName: "Name" }),
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
    ...rel.section.singleTimeList("upfrontCostList", "Upfront Costs"),
    ...rel.section.singleTimeList("upfrontRevenueList", "Upfront Revenue"),
    ...rel.section.ongoingList("ongoingCostList", "Ongoing Costs"),
    ...rel.section.ongoingList("ongoingRevenueList", "Ongoing Revenue"),

    // savable sections and their children
    ...preUserLists,
    ...prePropertyGeneral,
    ...relFinancing,
    ...preMgmtGeneral,
    ...relAnalysisStuff,

    ...relSection.base("totalInsAndOuts", "Total Incomes and Expenses", {
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
        [rel.varbInfo.relative("propertyGeneral", "upfrontRevenue", "static")],
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
    //
    ...relSection.base("final", "Final Calculations", {
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
  } as const;
}

export const relSections = makeRelSections();

export type RelSectionsTemplate = {
  [Prop in keyof BaseSections]: RelSection<
    Prop,
    string,
    RelVarbs<Prop>,
    RelSectionOptions
  >[Prop];
};

function typeTestRelSections<P extends RelSectionsTemplate>(relSections: P): P {
  return relSections;
}
typeTestRelSections(relSections);
