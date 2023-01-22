import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { relVarbInfosS } from "../SectionInfo/RelVarbInfos";
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
      updateFnPropS.varbPathName("loanUpfrontExpenses"),
    ]),

    outOfPocketExpenses: relVarbS.leftRightPropFn("simpleSubtract", [
      relVarbInfoS.local("upfrontExpenses"),
      updateFnPropS.varbPathName("loanTotalDollars"),
    ] as LeftRightVarbInfos),
    upfrontRevenue: relVarbS.sumNums([
      updateFnPropS.pathName("propertyFocal", "upfrontRevenue"),
    ]),
    ...updateVarbsS.ongoingSumNumsNext("expenses", "yearly", {
      updateFnProps: [
        updateFnPropS.pathName("propertyFocal", "expenses"),
        updateFnPropS.pathName("mgmtFocal", "expenses"),
        updateFnPropS.varbPathBase("loanExpenses"),
      ],
    }),

    // How can I get in to see what is the problem?
    // Reimplement
    ...updateVarbsS.ongoingSumNums("revenue", [
      updateFnPropS.pathName("propertyFocal", "revenue"),
    ]),
  } as UpdateSectionVarbs<"deal">;
}
