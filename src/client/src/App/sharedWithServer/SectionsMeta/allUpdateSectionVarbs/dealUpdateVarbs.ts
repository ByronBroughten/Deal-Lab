import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import {
  LeftRightVarbInfos,
  relVarbS,
  updateVarb,
} from "../updateSectionVarbs/updateVarb";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

export function dealRelVarbs(): UpdateSectionVarbs<"deal"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    ...updateVarbsS.ongoingSumNumsNext("piti", "monthly", {
      updateFnProps: [
        updateFnPropS.varbPathBase("taxes"),
        updateFnPropS.varbPathBase("homeIns"),
        updateFnPropS.varbPathBase("mortgageIns"),
        updateFnPropS.varbPathBase("loanPayment"),
      ],
    }),
    dealMode: updateVarb("string", { initValue: "buyAndHold" }),
    downPaymentDollars: relVarbS.leftRightPropFn("simpleSubtract", [
      updateFnPropS.varbPathName("price"),
      updateFnPropS.varbPathName("loanBaseDollars"),
    ]),
    downPaymentDecimal: relVarbS.leftRightPropFn("simpleDivide", [
      updateFnPropS.local("downPaymentDollars"),
      updateFnPropS.varbPathName("price"),
    ]),
    downPaymentPercent: relVarbS.singlePropFn(
      "decimalToPercent",
      updateFnPropS.local("downPaymentDecimal")
    ),
    totalInvestment: relVarbS.leftRightPropFn(
      "simpleSubtract",
      updateFnPropS.localArr(
        "outOfPocketExpenses",
        "upfrontRevenue"
      ) as LeftRightVarbInfos
    ),
    cashFlowMonthly: relVarbS.leftRightPropFn(
      "simpleSubtract",
      updateFnPropS.localArr(
        "revenueMonthly",
        "expensesMonthly"
      ) as LeftRightVarbInfos
    ),
    cashFlowYearly: relVarbS.leftRightPropFn(
      "simpleSubtract",
      updateFnPropS.localArr(
        "revenueYearly",
        "expensesYearly"
      ) as LeftRightVarbInfos
    ),
    cashFlowOngoingSwitch: updateVarb("string", {
      initValue: "yearly",
    }),
    cocRoiDecimalMonthly: relVarbS.leftRightPropFn(
      "simpleDivide",
      updateFnPropS.localArr(
        "cashFlowMonthly",
        "totalInvestment"
      ) as LeftRightVarbInfos
    ),
    cocRoiMonthly: relVarbS.singlePropFn(
      "decimalToPercent",
      updateFnPropS.local("cocRoiDecimalMonthly")
    ),
    cocRoiDecimalYearly: relVarbS.leftRightPropFn(
      "simpleDivide",
      updateFnPropS.localArr(
        "cashFlowYearly",
        "totalInvestment"
      ) as LeftRightVarbInfos
    ),
    cocRoiYearly: relVarbS.singlePropFn(
      "decimalToPercent",
      updateFnPropS.local("cocRoiDecimalYearly")
    ),
    cocRoiOngoingSwitch: updateVarb("string", {
      initValue: "yearly",
    }),
    upfrontExpenses: relVarbS.sumNums([
      updateFnPropS.pathNameBase("propertyFocal", "upfrontExpenses"),
      updateFnPropS.pathNameBase("mgmtFocal", "upfrontExpenses"),
      updateFnPropS.varbPathName("loanUpfrontExpenses"),
    ]),

    outOfPocketExpenses: relVarbS.leftRightPropFn("simpleSubtract", [
      updateFnPropS.local("upfrontExpenses"),
      updateFnPropS.varbPathName("loanTotalDollars"),
    ]),
    upfrontRevenue: relVarbS.sumNums([
      updateFnPropS.pathNameBase("propertyFocal", "upfrontRevenue"),
    ]),
    ...updateVarbsS.ongoingSumNumsNext("expenses", "yearly", {
      updateFnProps: [
        updateFnPropS.pathNameBase("propertyFocal", "expenses"),
        updateFnPropS.pathNameBase("mgmtFocal", "expenses"),
        updateFnPropS.varbPathBase("loanExpenses"),
      ],
    }),
    ...updateVarbsS.ongoingSumNums("revenue", [
      updateFnPropS.pathNameBase("propertyFocal", "revenue"),
    ]),
  } as UpdateSectionVarbs<"deal">;
}
