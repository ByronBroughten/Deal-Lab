import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import {
  LeftRightVarbInfos,
  updateVarb,
  updateVarbS,
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
    downPaymentDollars: updateVarbS.leftRightPropFn("simpleSubtract", [
      updateFnPropS.varbPathName("price"),
      updateFnPropS.varbPathName("loanBaseDollars"),
    ]),
    downPaymentDecimal: updateVarbS.leftRightPropFn("simpleDivide", [
      updateFnPropS.local("downPaymentDollars"),
      updateFnPropS.varbPathName("price"),
    ]),
    downPaymentPercent: updateVarbS.singlePropFn(
      "decimalToPercent",
      updateFnPropS.local("downPaymentDecimal")
    ),
    totalInvestment: updateVarbS.leftRightPropFn(
      "simpleSubtract",
      updateFnPropS.localArr(
        "outOfPocketExpenses",
        "upfrontRevenue"
      ) as LeftRightVarbInfos
    ),
    cashFlowMonthly: updateVarbS.leftRightPropFn(
      "simpleSubtract",
      updateFnPropS.localArr(
        "revenueMonthly",
        "expensesMonthly"
      ) as LeftRightVarbInfos
    ),
    cashFlowYearly: updateVarbS.leftRightPropFn(
      "simpleSubtract",
      updateFnPropS.localArr(
        "revenueYearly",
        "expensesYearly"
      ) as LeftRightVarbInfos
    ),
    cashFlowOngoingSwitch: updateVarb("string", {
      initValue: "yearly",
    }),
    cocRoiDecimalMonthly: updateVarbS.leftRightPropFn(
      "simpleDivide",
      updateFnPropS.localArr(
        "cashFlowMonthly",
        "totalInvestment"
      ) as LeftRightVarbInfos
    ),
    cocRoiMonthly: updateVarbS.singlePropFn(
      "decimalToPercent",
      updateFnPropS.local("cocRoiDecimalMonthly")
    ),
    cocRoiDecimalYearly: updateVarbS.leftRightPropFn(
      "simpleDivide",
      updateFnPropS.localArr(
        "cashFlowYearly",
        "totalInvestment"
      ) as LeftRightVarbInfos
    ),
    cocRoiYearly: updateVarbS.singlePropFn(
      "decimalToPercent",
      updateFnPropS.local("cocRoiDecimalYearly")
    ),
    cocRoiOngoingSwitch: updateVarb("string", {
      initValue: "yearly",
    }),
    upfrontExpenses: updateVarbS.sumNums([
      updateFnPropS.pathNameBase("propertyFocal", "upfrontExpenses"),
      updateFnPropS.pathNameBase("mgmtFocal", "upfrontExpenses"),
      updateFnPropS.varbPathName("loanUpfrontExpenses"),
    ]),

    outOfPocketExpenses: updateVarbS.leftRightPropFn("simpleSubtract", [
      updateFnPropS.local("upfrontExpenses"),
      updateFnPropS.varbPathName("loanTotalDollars"),
    ]),
    upfrontRevenue: updateVarbS.sumNums([
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
