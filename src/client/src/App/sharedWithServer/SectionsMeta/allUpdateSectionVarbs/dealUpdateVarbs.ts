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
import { dealCompletionStatus } from "./calculatedUpdateVarbs/completionStatusVarbs";

const notApplicable = () => updateBasics("notApplicable");
const propS = updateFnPropS;
const basicsS = updateBasicsS;

export function dealUpdateVarbs(): UpdateSectionVarbs<"deal"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    ...updateVarbsS.displayNameAndEditor,
    completionStatus: dealCompletionStatus,
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
      brrrr: basicsS.sumNums(
        propS.onlyChild("property", "purchasePrice"),
        propS.varbPathName("closingCosts"),
        propS.onlyChild("property", "rehabCost"),
        propS.onlyChild("property", "miscOnetimeCosts"),
        propS.onlyChild("property", "holdingCostTotal"),
        propS.onlyChild("mgmt", "miscOnetimeCosts")
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
        // Interesting. It's the refinance loan that's used to calculate
        // ongoing expenses for brrrr, not the purchase loan.
        // So for the varbPath, do I need purchaseLoanExpensesMonthly?
        // And refiLoanExpensesMonthly?

        // No, I can sidestep that whole problem by just using
        // childVarbs again.
        // I'll still need some varbPathInfos, though, if people want to select
        // variables.
        // Ah, this gets so tricky. In BRRRR mode, PITI refers to the refi loan
        // But in other cases, it refers to the purchase loan.

        // For brrrr and fixAndFlip
        // - the purchase loan is for the holding period
        // - the purchase loan is based on purchasePrice and repairs
        // For brrrr
        // - the refi loan is for ongoing
        // - the refi loan is based on arv

        // for rentalProperty and homeBuyer
        // - the purchase loan is for ongoing
        // - the purchase loan is based on purchasePrice and repairs

        // Now, technically, all loans can be capable of being based on
        // purchasePrice or ARV. I can change the available and active options
        // based on dealMode

        // Ah, but I can use dealMode switches for PITIongoing and PITIholding, etc.
        // I think I'll just do it that way, even if it's somewhat painful.

        // So PITIholding and PITIongoing will be a thing
        // Or maybe just PITIongoing
      ),
      fixAndFlip: notApplicable(),
      brrrr: basicsS.sumNums(
        propS.pathNameBase("propertyFocal", "expensesMonthly"),
        propS.pathNameBase("mgmtFocal", "expensesMonthly"),
        propS.varbPathBase("loanExpensesMonthly")
      ),
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
      brrrr: basicsS.sumNums(
        propS.pathNameBase("propertyFocal", "expensesYearly"),
        propS.pathNameBase("mgmtFocal", "expensesYearly"),
        propS.varbPathBase("loanExpensesYearly")
      ),
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
      brrrr: updateVarbS.leftRightPropFn(
        "simpleSubtract",
        propS.pathNameBase("propertyFocal", "revenueMonthly"),
        propS.local("expensesMonthly")
      ),
    }),
    cashFlowYearly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.leftRightPropFn(
        "simpleSubtract",
        propS.pathNameBase("propertyFocal", "revenueYearly"),
        propS.local("expensesYearly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: updateVarbS.leftRightPropFn(
        "simpleSubtract",
        propS.pathNameBase("propertyFocal", "revenueYearly"),
        propS.local("expensesYearly")
      ),
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
      brrrr: updateVarbS.leftRightPropFn(
        "divide",
        propS.local("cashFlowMonthly"),
        propS.local("totalInvestment")
      ),
    }),
    cocRoiDecimalYearly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.leftRightPropFn(
        "divide",
        propS.local("cashFlowYearly"),
        propS.local("totalInvestment")
      ),
      fixAndFlip: notApplicable(),
      brrrr: updateVarbS.leftRightPropFn(
        "divide",
        propS.local("cashFlowYearly"),
        propS.local("totalInvestment")
      ),
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
      brrrr: updateVarbS.singlePropFn(
        "decimalToPercent",
        propS.local("cocRoiDecimalMonthly")
      ),
    }),
    cocRoiYearly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.singlePropFn(
        "decimalToPercent",
        propS.local("cocRoiDecimalYearly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: updateVarbS.singlePropFn(
        "decimalToPercent",
        propS.local("cocRoiDecimalYearly")
      ),
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
      brrrr: updateVarbS.sumNums([
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
      brrrr: basicsS.equationLR(
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
      brrrr: basicsS.equationSimple(
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
      brrrr: basicsS.equationLR(
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
      brrrr: basicsS.equationLR(
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
      brrrr: basicsS.equationLR(
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
        completionStatus: updateFnPropS.local("completionStatus"),
      },
    }),
  } as UpdateSectionVarbs<"deal">;
}
