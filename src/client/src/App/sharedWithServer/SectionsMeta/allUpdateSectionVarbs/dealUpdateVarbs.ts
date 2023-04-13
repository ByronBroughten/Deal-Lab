import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import {
  LeftRightVarbInfos,
  updateVarb,
  updateVarbS,
} from "../updateSectionVarbs/updateVarb";
import {
  updateBasics,
  updateBasicsS,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

export function dealUpdateVarbs(): UpdateSectionVarbs<"deal"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    ...updateVarbsS.displayNameAndEditor,
    displayName: updateVarb("stringObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local("displayNameSource", "displayNameEditor")],
          updateBasicsS.localStringToStringObj("displayNameEditor")
        ),
        updateOverride(
          [overrideSwitchS.local("displayNameSource", "defaultDisplayName")],
          updateBasics("defaultDealDisplayName")
        ),
      ],
    }),
    displayNameSource: updateVarb("dealDisplayNameSource", {
      initValue: "defaultDisplayName",
    }),
    dealMode: updateVarb("dealMode", { initValue: "buyAndHold" }),
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
