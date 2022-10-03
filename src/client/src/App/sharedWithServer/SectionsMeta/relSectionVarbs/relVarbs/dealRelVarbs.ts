import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relAdorn } from "../rel/relAdorn";
import { LeftRightVarbInfos, relVarb, relVarbS } from "../rel/relVarb";
import { RelVarbs, relVarbsS } from "../relVarbs";

export function dealRelVarbs(): RelVarbs<"deal"> {
  return {
    ...relVarbsS._typeUniformity,
    ...relVarbsS.savableSection,
    ...relVarbsS.ongoingSumNums(
      "piti",
      "PITI payment",
      [
        relVarbInfoS.children("financing", "mortgageIns"),
        relVarbInfoS.children("financing", "loanPayment"),
        relVarbInfoS.children("propertyGeneral", "taxes"),
        relVarbInfoS.children("propertyGeneral", "homeIns"),
      ],
      { shared: { startAdornment: "$" }, switchInit: "monthly" }
    ),
    showCalculationsStatus: relVarb("string", { initValue: "hide" }),
    downPaymentDollars: relVarbS.leftRightPropFn(
      "Down payment",
      "simpleSubtract",
      [
        relVarbInfoS.children("propertyGeneral", "price"),
        relVarbInfoS.children("financing", "loanBaseDollars"),
      ],
      { startAdornment: "$", displayNameEnd: " dollars" }
    ),
    downPaymentDecimal: relVarbS.leftRightPropFn(
      "Down payment",
      "simpleDivide",
      [
        relVarbInfoS.local("downPaymentDollars"),
        relVarbInfoS.children("propertyGeneral", "price"),
      ],
      { displayNameEnd: "decimal", unit: "decimal" }
    ),
    downPaymentPercent: relVarbS.singlePropFn(
      "Down payment",
      "decimalToPercent",
      relVarbInfoS.local("downPaymentDecimal"),
      { endAdornment: "%", displayNameEnd: "percent", unit: "percent" }
    ),
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
    roiDecimalMonthly: relVarbS.leftRightPropFn(
      "Monthly ROI Decimal",
      "simpleDivide",
      relVarbInfosS.local([
        "cashFlowMonthly",
        "totalInvestment",
      ]) as LeftRightVarbInfos,
      { unit: "decimal" }
    ),
    roiMonthly: relVarbS.singlePropFn(
      "Monthly ROI",
      "decimalToPercent",
      relVarbInfoS.local("roiDecimalMonthly"),
      { endAdornment: "%", unit: "percent" }
    ),
    roiDecimalYearly: relVarbS.leftRightPropFn(
      "Annual ROI Decimal",
      "simpleDivide",
      relVarbInfosS.local([
        "cashFlowYearly",
        "totalInvestment",
      ]) as LeftRightVarbInfos,
      { unit: "decimal" }
    ),
    roiYearly: relVarbS.singlePropFn(
      "Annual ROI",
      "decimalToPercent",
      relVarbInfoS.local("roiDecimalYearly"),
      { endAdornment: "%", unit: "percent" }
    ),
    roiOngoingSwitch: relVarb("string", {
      initValue: "yearly",
    }),
    upfrontExpensesBaseSum: relVarbS.sumNums(
      "Upfront expenses pre wrapped-in-loan",
      [
        relVarbInfoS.local("downPaymentDollars"),
        relVarbInfoS.children("propertyGeneral", "upfrontExpenses"),
        relVarbInfoS.children("mgmtGeneral", "upfrontExpenses"),
        ...relVarbInfosS.children("financing", [
          "closingCosts",
          "mortgageInsUpfront",
        ]),
      ],
      { startAdornment: "$" }
    ),
    upfrontExpenses: relVarbS.leftRightPropFn(
      "Upfront expenses total",
      "simpleSubtract",
      [
        relVarbInfoS.local("upfrontExpensesBaseSum"),
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
      relVarbInfoS.children("propertyGeneral", "expenses"),
      relVarbInfoS.children("mgmtGeneral", "expenses"),
      relVarbInfoS.children("financing", "expenses"),
    ]),
    ...relVarbsS.ongoingSumNums(
      "revenue",
      "Revenue",
      [relVarbInfoS.children("propertyGeneral", "revenue")],
      { shared: { startAdornment: "$" }, switchInit: "monthly" }
    ),
  } as RelVarbs<"deal">;
}
