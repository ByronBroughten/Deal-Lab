import { relVarbInfoS } from "../../SectionInfo/RelVarbInfo";
import { relVarbInfosS } from "../../SectionInfo/RelVarbInfos";
import { relAdorn } from "../rel/relAdorn";
import { LeftRightVarbInfos, relVarb, relVarbS } from "../rel/relVarb";
import { updateFnPropS, updateFnPropsS } from "../rel/UpdateFnProps";
import { RelVarbs, relVarbsS } from "../relVarbs";

export function dealRelVarbs(): RelVarbs<"deal"> {
  return {
    ...relVarbsS._typeUniformity,
    ...relVarbsS.savableSection,
    ...relVarbsS.ongoingSumNums(
      "piti",
      "PITI payment",
      [
        updateFnPropS.children("financing", "mortgageIns"),
        updateFnPropS.children("financing", "loanPayment"),
        updateFnPropS.children("propertyGeneral", "taxes"),
        updateFnPropS.children("propertyGeneral", "homeIns"),
      ],
      { shared: { startAdornment: "$" }, switchInit: "monthly" }
    ),
    showCalculationsStatus: relVarb("string", { initValue: "hide" }),
    downPaymentDollars: relVarbS.leftRightPropFn(
      "Down payment",
      "simpleSubtract",
      [
        updateFnPropS.children("propertyGeneral", "price"),
        updateFnPropS.children("financing", "loanBaseDollars"),
      ],
      { startAdornment: "$", displayNameEnd: " dollars" }
    ),
    downPaymentDecimal: relVarbS.leftRightPropFn(
      "Down payment",
      "simpleDivide",
      [
        updateFnPropS.local("downPaymentDollars"),
        updateFnPropS.children("propertyGeneral", "price"),
      ],
      { displayNameEnd: "decimal", unit: "decimal" }
    ),
    downPaymentPercent: relVarbS.singlePropFn(
      "Down payment",
      "decimalToPercent",
      updateFnPropS.local("downPaymentDecimal"),
      { endAdornment: "%", displayNameEnd: "percent", unit: "percent" }
    ),
    totalInvestment: relVarbS.leftRightPropFn(
      "Upfront investment",
      "simpleSubtract",
      relVarbInfosS.local([
        "outOfPocketExpenses",
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
    cocRoiDecimalMonthly: relVarbS.leftRightPropFn(
      "Monthly CoC ROI Decimal",
      "simpleDivide",
      relVarbInfosS.local([
        "cashFlowMonthly",
        "totalInvestment",
      ]) as LeftRightVarbInfos,
      { unit: "decimal" }
    ),
    cocRoiMonthly: relVarbS.singlePropFn(
      "Monthly CoC ROI",
      "decimalToPercent",
      updateFnPropS.local("cocRoiDecimalMonthly"),
      { endAdornment: "%", unit: "percent" }
    ),
    cocRoiDecimalYearly: relVarbS.leftRightPropFn(
      "Annual CoC ROI Decimal",
      "simpleDivide",
      relVarbInfosS.local([
        "cashFlowYearly",
        "totalInvestment",
      ]) as LeftRightVarbInfos,
      { unit: "decimal" }
    ),
    cocRoiYearly: relVarbS.singlePropFn(
      "Annual CoC ROI",
      "decimalToPercent",
      updateFnPropS.local("cocRoiDecimalYearly"),
      { endAdornment: "%", unit: "percent" }
    ),
    cocRoiOngoingSwitch: relVarb("string", {
      initValue: "yearly",
    }),
    upfrontExpenses: relVarbS.sumNums(
      "All upfront expenses",
      [
        updateFnPropS.children("propertyGeneral", "upfrontExpenses"),
        updateFnPropS.children("mgmtGeneral", "upfrontExpenses"),
        ...updateFnPropsS.childrenByVarbName("financing", [
          "closingCosts",
          "mortgageInsUpfront",
        ]),
      ],
      { startAdornment: "$" }
    ),
    outOfPocketExpenses: relVarbS.leftRightPropFn(
      "Upfront expenses minus loan",
      "simpleSubtract",
      [
        relVarbInfoS.local("upfrontExpenses"),
        relVarbInfoS.children("financing", "loanTotalDollars"),
      ] as LeftRightVarbInfos,
      { startAdornment: "$" }
    ),
    upfrontRevenue: relVarbS.sumNums(
      "Upfront revenue",
      [updateFnPropS.children("propertyGeneral", "upfrontRevenue")],
      { startAdornment: "$" }
    ),
    ...relVarbsS.ongoingSumNums("expenses", "Ongoing expenses", [
      updateFnPropS.children("propertyGeneral", "expenses"),
      updateFnPropS.children("mgmtGeneral", "expenses"),
      updateFnPropS.children("financing", "expenses"),
    ]),
    ...relVarbsS.ongoingSumNums(
      "revenue",
      "Revenue",
      [updateFnPropS.children("propertyGeneral", "revenue")],
      { shared: { startAdornment: "$" }, switchInit: "monthly" }
    ),
  } as RelVarbs<"deal">;
}
