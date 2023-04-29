import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import {
  LeftRightUpdateProps,
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
  unionSwitchOverride,
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
      initValue: "displayNameEditor",
    }),
    isComplete: updateVarb("boolean", {
      initValue: true,
      updateFnName: "activeIsComplete",
      updateFnProps: {
        completionStatus: updateFnPropS.pathName(
          "calculatedVarbsFocal",
          "dealCompletionStatus"
        ),
      },
    }),
    dealMode: updateVarb("dealMode", { initValue: "buyAndHold" }),
    totalInvestment: updateVarbS.leftRightPropFn(
      "simpleSubtract",
      updateFnPropS.localArr(
        "outOfPocketExpenses",
        "upfrontRevenue"
      ) as LeftRightUpdateProps
    ),
    cashFlowMonthly: updateVarbS.leftRightPropFn(
      "simpleSubtract",
      updateFnPropS.localArr(
        "revenueMonthly",
        "expensesMonthly"
      ) as LeftRightUpdateProps
    ),
    cashFlowYearly: updateVarbS.leftRightPropFn(
      "simpleSubtract",
      updateFnPropS.localArr(
        "revenueYearly",
        "expensesYearly"
      ) as LeftRightUpdateProps
    ),
    cashFlowOngoingSwitch: updateVarb("string", {
      initValue: "yearly",
    }),
    cocRoiDecimalMonthly: updateVarbS.leftRightPropFn(
      "simpleDivide",
      updateFnPropS.localArr(
        "cashFlowMonthly",
        "totalInvestment"
      ) as LeftRightUpdateProps
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
      ) as LeftRightUpdateProps
    ),
    cocRoiYearly: updateVarbS.singlePropFn(
      "decimalToPercent",
      updateFnPropS.local("cocRoiDecimalYearly")
    ),
    cocRoiOngoingSwitch: updateVarb("string", {
      initValue: "yearly",
    }),
    neededCashPlusLoanRepay: updateVarbS.sumNums([
      updateFnPropS.varbPathName("loanTotalDollars"),
      updateFnPropS.local("totalInvestment"),
    ]),
    totalProfit: updateVarb("numObj", {
      // shoot. propertyFocal isn't going to work right.
      // this really needs updateFn: "N/A"

      ...updateBasicsS.equationLeftRight(
        "simpleSubtract",
        updateFnPropS.onlyChild("property", "afterRepairValue"),
        updateFnPropS.local("neededCashPlusLoanRepay")
      ),
    }),
    // Ok, now there is only one focalProperty.
    // Let's do a typecheck.

    // roiDecimal,
    // roiPercent,
    // roiPercentAnnualized,

    // totalProfit / totalExpenses

    upfrontExpenses: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: unionSwitchOverride(
        "dealMode",
        relVarbInfoS.local("dealMode"),
        {
          buyAndHold: updateVarbS.sumNums([
            updateFnPropS.pathNameBase("propertyFocal", "upfrontExpenses"),
            updateFnPropS.pathNameBase("mgmtFocal", "upfrontExpenses"),
            updateFnPropS.varbPathName("loanUpfrontExpenses"),
          ]),
          fixAndFlip: updateVarbS.sumNums([
            updateFnPropS.pathNameBase("propertyFocal", "upfrontExpenses"),
            updateFnPropS.varbPathName("loanUpfrontExpenses"),
          ]),
        }
      ),
    }),
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
