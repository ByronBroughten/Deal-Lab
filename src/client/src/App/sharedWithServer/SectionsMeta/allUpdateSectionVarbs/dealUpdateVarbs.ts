import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import {
  updateBasics,
  updateBasicsS,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { dealModeVarb } from "../updateSectionVarbs/updateVarb/updateVarbUtils";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

const notApplicable = () => updateBasics("notApplicable");
const propS = updateFnPropS;
const basicsS = updateBasicsS;

export function dealUpdateVarbs(): UpdateSectionVarbs<"deal"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    ...updateVarbsS.displayNameAndEditor,
    dealMode: updateVarb("dealMode", { initValue: "buyAndHold" }),
    preFinanceOneTimeExpenses: dealModeVarb({
      homeBuyer: basicsS.sumNums(
        propS.onlyChild("property", "purchasePrice"),
        propS.varbPathName("closingCosts"),
        propS.onlyChild("property", "rehabCost"),
        propS.onlyChild("property", "miscOnetimeCosts")
      ),
      buyAndHold: basicsS.sumNums(
        propS.onlyChild("property", "purchasePrice"),
        propS.varbPathName("closingCosts"),
        propS.onlyChild("property", "rehabCost"),
        propS.onlyChild("property", "miscOnetimeCosts"),
        propS.onlyChild("mgmt", "miscOnetimeCosts")
      ),
      fixAndFlip: basicsS.sumNums(
        propS.onlyChild("property", "purchasePrice"),
        propS.varbPathName("closingCosts"),
        propS.onlyChild("property", "holdingCostTotal"),
        propS.onlyChild("property", "rehabCost"),
        propS.onlyChild("property", "sellingCosts"),
        propS.onlyChild("property", "miscOnetimeCosts")
      ),
    }),
    totalInvestment: updateVarb(
      "numObj",
      basicsS.equationLR(
        "simpleSubtract",
        propS.local("preFinanceOneTimeExpenses"),
        propS.varbPathName("loanTotalDollars")
      )
    ),
    expensesMonthly: dealModeVarb({
      homeBuyer: basicsS.sumNums(
        propS.pathNameBase("propertyFocal", "expensesMonthly"),
        propS.varbPathBase("loanExpensesMonthly")
      ),
      buyAndHold: basicsS.sumNums(
        propS.pathNameBase("propertyFocal", "expensesMonthly"),
        propS.pathNameBase("mgmtFocal", "expensesMonthly"),
        propS.varbPathBase("loanExpensesMonthly")
      ),
      fixAndFlip: notApplicable(),
    }),
    expensesYearly: dealModeVarb({
      homeBuyer: basicsS.sumNums(
        propS.pathNameBase("propertyFocal", "expensesYearly"),
        propS.varbPathBase("loanExpensesYearly")
      ),
      buyAndHold: basicsS.sumNums(
        propS.pathNameBase("propertyFocal", "expensesYearly"),
        propS.pathNameBase("mgmtFocal", "expensesYearly"),
        propS.varbPathBase("loanExpensesYearly")
      ),
      fixAndFlip: notApplicable(),
    }),
    expensesOngoingSwitch: updateVarb("ongoingSwitch", {
      initValue: "monthly",
    }),
    cashFlowMonthly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.leftRightPropFn(
        "simpleSubtract",
        propS.pathNameBase("propertyFocal", "revenueMonthly"),
        propS.local("expensesMonthly")
      ),
      fixAndFlip: notApplicable(),
    }),
    cashFlowYearly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.leftRightPropFn(
        "simpleSubtract",
        propS.pathNameBase("propertyFocal", "revenueYearly"),
        propS.local("expensesYearly")
      ),
      fixAndFlip: notApplicable(),
    }),
    cashFlowOngoingSwitch: updateVarb("ongoingSwitch", {
      initValue: "yearly",
    }),
    cocRoiDecimalMonthly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.leftRightPropFn(
        "divide",
        propS.local("cashFlowMonthly"),
        propS.local("totalInvestment")
      ),
      fixAndFlip: notApplicable(),
    }),
    cocRoiDecimalYearly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.leftRightPropFn(
        "divide",
        propS.local("cashFlowYearly"),
        propS.local("totalInvestment")
      ),
      fixAndFlip: notApplicable(),
    }),
    cocRoiDecimalOngoingSwitch: updateVarb("ongoingSwitch", {
      initValue: "yearly",
    }),
    cocRoiMonthly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.singlePropFn(
        "decimalToPercent",
        propS.local("cocRoiDecimalMonthly")
      ),
      fixAndFlip: notApplicable(),
    }),
    cocRoiYearly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.singlePropFn(
        "decimalToPercent",
        propS.local("cocRoiDecimalYearly")
      ),
      fixAndFlip: notApplicable(),
    }),
    cocRoiOngoingSwitch: updateVarb("ongoingSwitch", {
      initValue: "yearly",
    }),
    cashExpensesPlusLoanRepay: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: updateVarbS.sumNums([
        propS.local("totalInvestment"),
        propS.varbPathName("loanTotalDollars"),
      ]),
    }),
    totalProfit: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationLR(
        "simpleSubtract",
        propS.onlyChild("property", "afterRepairValue"),
        propS.local("cashExpensesPlusLoanRepay")
      ),
    }),
    roiPercent: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationSimple(
        "decimalToPercent",
        propS.local("roiDecimal")
      ),
    }),
    roiDecimal: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationLR(
        "divide",
        propS.local("totalProfit"),
        propS.local("totalInvestment")
      ),
    }),
    roiPercentPerMonth: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationLR(
        "divide",
        propS.local("roiPercent"),
        propS.onlyChild("property", "holdingPeriodMonths")
      ),
    }),
    roiPercentAnnualized: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationLR(
        "multiply",
        propS.varbPathName("twelve"),
        propS.local("roiPercentPerMonth")
      ),
    }),
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
  } as UpdateSectionVarbs<"deal">;
}
