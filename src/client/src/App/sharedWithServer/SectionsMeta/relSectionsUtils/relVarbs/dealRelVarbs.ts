import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { rel } from "../rel";
import { relAdorn } from "../rel/relAdorn";
import { LeftRightVarbInfos, relVarb, relVarbS } from "../rel/relVarb";
import { RelVarbs, relVarbsS } from "../relVarbs";

export function dealRelVarbs(): RelVarbs<"deal"> {
  return {
    ...relVarbsS.savableSection,
    totalInvestment: rel.varb.leftRightPropFn(
      "Upfront investment",
      "simpleSubtract",
      relVarbInfosS.local([
        "upfrontExpenses",
        "upfrontRevenue",
      ]) as LeftRightVarbInfos,
      { startAdornment: "$" }
    ),
    cashFlowMonthly: rel.varb.leftRightPropFn(
      "Monthly cash flow",
      "simpleSubtract",
      relVarbInfosS.local([
        "revenueMonthly",
        "expensesMonthly",
      ]) as LeftRightVarbInfos,
      relAdorn.moneyMonth
    ),
    cashFlowYearly: rel.varb.leftRightPropFn(
      "Annual cash flow",
      "simpleSubtract",
      relVarbInfosS.local([
        "revenueYearly",
        "expensesYearly",
      ]) as LeftRightVarbInfos,
      relAdorn.moneyYear
    ),
    cashFlowOngoingSwitch: relVarb("string", {
      initValue: "yearly",
    }),
    roiMonthly: rel.varb.leftRightPropFn(
      "Monthly ROI",
      "divideToPercent",
      relVarbInfosS.local([
        "cashFlowMonthly",
        "totalInvestment",
      ]) as LeftRightVarbInfos,
      { endAdornment: "%", unit: "percent" }
    ),
    roiYearly: rel.varb.leftRightPropFn(
      "Annual ROI",
      "divideToPercent",
      relVarbInfosS.local([
        "cashFlowYearly",
        "totalInvestment",
      ]) as LeftRightVarbInfos,
      { endAdornment: "%", unit: "percent" }
    ),
    roiOngoingSwitch: relVarb("string", {
      initValue: "yearly",
    }),
    upfrontExpensesSum: relVarbS.sumNums(
      "Sum of upfront expenses",
      [
        relVarbInfoS.children("propertyGeneral", "upfrontExpenses"),
        relVarbInfoS.children("mgmtGeneral", "upfrontExpenses"),
        ...relVarbInfosS.children("financing", [
          "downPaymentDollars",
          "closingCosts",
          "mortInsUpfront",
        ]),
      ],
      { startAdornment: "$" }
    ),
    upfrontExpenses: rel.varb.leftRightPropFn(
      "Total upfront expenses",
      "simpleSubtract",
      [
        relVarbInfoS.local("upfrontExpensesSum"),
        relVarbInfoS.children("financing", "wrappedInLoan"),
      ] as LeftRightVarbInfos,
      { startAdornment: "$" }
    ),
    upfrontRevenue: rel.varb.sumNums(
      "Upfront revenue",
      [relVarbInfoS.children("propertyGeneral", "upfrontRevenue")],
      { startAdornment: "$" }
    ),
    ...relVarbsS.ongoingSumNums("expenses", "Ongoing expenses", [
      relVarbInfoS.children("propertyGeneral", "ongoingExpenses"),
      relVarbInfoS.children("mgmtGeneral", "ongoingExpenses"),
      relVarbInfoS.children("financing", "piti"),
    ]),
    ...relVarbsS.ongoingSumNums(
      "revenue",
      "Ongoing revenue",
      [relVarbInfoS.children("propertyGeneral", "ongoingRevenue")],
      { shared: { startAdornment: "$" }, switchInit: "monthly" }
    ),
  } as RelVarbs<"deal">;
}
