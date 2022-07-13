import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relAdorn } from "../rel/relAdorn";
import { LeftRightVarbInfos, relVarb, relVarbS } from "../rel/relVarb";
import { RelVarbs, relVarbsS } from "../relVarbs";

export function dealRelVarbs(): RelVarbs<"deal"> {
  return {
    ...relVarbsS.savableSection,
    totalInvestment: relVarbS.leftRightPropFn(
      "Upfront investment",
      "simpleSubtract",
      relVarbInfosS.local([
        "upfrontExpenses",
        "upfrontRevenue",
      ]) as LeftRightVarbInfos,
      { startAdornment: "$" }
    ),
    cashFlowMonthly: relVarbS.leftRightPropFn(
      "Monthly cash flow",
      "simpleSubtract",
      relVarbInfosS.local([
        "revenueMonthly",
        "expensesMonthly",
      ]) as LeftRightVarbInfos,
      relAdorn.moneyMonth
    ),
    cashFlowYearly: relVarbS.leftRightPropFn(
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
    roiMonthly: relVarbS.leftRightPropFn(
      "Monthly ROI",
      "divideToPercent",
      relVarbInfosS.local([
        "cashFlowMonthly",
        "totalInvestment",
      ]) as LeftRightVarbInfos,
      { endAdornment: "%", unit: "percent" }
    ),
    roiYearly: relVarbS.leftRightPropFn(
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
      "Upfront expenses pre wrapped-in-loan",
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
    upfrontExpenses: relVarbS.leftRightPropFn(
      "Upfront expenses total",
      "simpleSubtract",
      [
        relVarbInfoS.local("upfrontExpensesSum"),
        relVarbInfoS.children("financing", "wrappedInLoan"),
      ] as LeftRightVarbInfos,
      { startAdornment: "$" }
    ),
    upfrontRevenue: relVarbS.sumNums(
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
      "Revenue",
      [relVarbInfoS.children("propertyGeneral", "ongoingRevenue")],
      { shared: { startAdornment: "$" }, switchInit: "monthly" }
    ),
  } as RelVarbs<"deal">;
}
