import { relVarbInfoS } from "../../SectionInfo/RelVarbInfo";
import { relVarbInfosS } from "../../SectionInfo/RelVarbInfos";
import { LeftRightVarbInfos, relVarbS, updateVarb } from "../rel/updateVarb";
import { updateFnPropS } from "../rel/updateVarb/UpdateFnProps";
import { UpdateSectionVarbs, updateVarbsS } from "../updateVarbs";

export function dealRelVarbs(): UpdateSectionVarbs<"deal"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    ...updateVarbsS.ongoingSumNums("piti", [
      updateFnPropS.pathName("calculatedVarbsFocal", "mortgageIns"),
      updateFnPropS.pathName("calculatedVarbsFocal", "loanPayment"),
      updateFnPropS.pathName("propertyFocal", "taxes"),
      updateFnPropS.pathName("propertyFocal", "homeIns"),
    ]),
    showCalculationsStatus: updateVarb("string", { initValue: "hide" }),
    downPaymentDollars: relVarbS.leftRightPropFn("simpleSubtract", [
      updateFnPropS.pathName("propertyFocal", "price"),
      updateFnPropS.pathName("calculatedVarbsFocal", "loanBaseDollars"),
    ]),
    downPaymentDecimal: relVarbS.leftRightPropFn("simpleDivide", [
      updateFnPropS.local("downPaymentDollars"),
      updateFnPropS.pathName("propertyFocal", "price"),
    ]),
    downPaymentPercent: relVarbS.singlePropFn(
      "decimalToPercent",
      updateFnPropS.local("downPaymentDecimal")
    ),
    totalInvestment: relVarbS.leftRightPropFn(
      "simpleSubtract",
      relVarbInfosS.local([
        "outOfPocketExpenses",
        "upfrontRevenue",
      ]) as LeftRightVarbInfos
    ),
    cashFlowMonthly: relVarbS.leftRightPropFn(
      "simpleSubtract",
      relVarbInfosS.local([
        "revenueMonthly",
        "expensesMonthly",
      ]) as LeftRightVarbInfos
    ),
    cashFlowYearly: relVarbS.leftRightPropFn(
      "simpleSubtract",
      relVarbInfosS.local([
        "revenueYearly",
        "expensesYearly",
      ]) as LeftRightVarbInfos
    ),
    cashFlowOngoingSwitch: updateVarb("string", {
      initValue: "yearly",
    }),
    cocRoiDecimalMonthly: relVarbS.leftRightPropFn(
      "simpleDivide",
      relVarbInfosS.local([
        "cashFlowMonthly",
        "totalInvestment",
      ]) as LeftRightVarbInfos
    ),
    cocRoiMonthly: relVarbS.singlePropFn(
      "decimalToPercent",
      updateFnPropS.local("cocRoiDecimalMonthly")
    ),
    cocRoiDecimalYearly: relVarbS.leftRightPropFn(
      "simpleDivide",
      relVarbInfosS.local([
        "cashFlowYearly",
        "totalInvestment",
      ]) as LeftRightVarbInfos
    ),
    cocRoiYearly: relVarbS.singlePropFn(
      "decimalToPercent",
      updateFnPropS.local("cocRoiDecimalYearly")
    ),
    cocRoiOngoingSwitch: updateVarb("string", {
      initValue: "yearly",
    }),
    upfrontExpenses: relVarbS.sumNums([
      updateFnPropS.pathName("propertyFocal", "upfrontExpenses"),
      updateFnPropS.pathName("mgmtFocal", "upfrontExpenses"),
      updateFnPropS.pathName("calculatedVarbsFocal", "loanUpfrontExpenses"),
    ]),

    outOfPocketExpenses: relVarbS.leftRightPropFn("simpleSubtract", [
      relVarbInfoS.local("upfrontExpenses"),
      updateFnPropS.pathName("calculatedVarbsFocal", "loanTotalDollars"),
    ] as LeftRightVarbInfos),
    upfrontRevenue: relVarbS.sumNums([
      updateFnPropS.pathName("propertyFocal", "upfrontRevenue"),
    ]),
    ...updateVarbsS.ongoingSumNums("expenses", [
      updateFnPropS.pathName("propertyFocal", "expenses"),
      updateFnPropS.pathName("mgmtFocal", "expenses"),
      updateFnPropS.pathName("calculatedVarbsFocal", "loanExpenses"),
    ]),
    ...updateVarbsS.ongoingSumNums("revenue", [
      updateFnPropS.pathName("propertyFocal", "revenue"),
    ]),
  } as UpdateSectionVarbs<"deal">;
}
