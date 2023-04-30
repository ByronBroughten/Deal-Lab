import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import {
  UpdateVarb,
  updateVarb,
  updateVarbS,
} from "../updateSectionVarbs/updateVarb";
import {
  UpdateBasics,
  updateBasics,
  updateBasicsS,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  unionSwitchOverride,
  updateOverride,
  UpdateOverrides,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { StateValue } from "../values/StateValue";

function dealModeOverride(
  overrideMap: Record<StateValue<"dealMode">, UpdateBasics>
): UpdateOverrides {
  return unionSwitchOverride(
    "dealMode",
    relVarbInfoS.local("dealMode"),
    overrideMap
  );
}

function dealModeVarb(
  overrideMap: Record<StateValue<"dealMode">, UpdateBasics>
): UpdateVarb<"numObj"> {
  return updateVarb("numObj", {
    updateFnName: "throwIfReached",
    updateOverrides: dealModeOverride(overrideMap),
  });
}

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
      fixAndFlip: basicsS.sumNums(
        propS.onlyChild("property", "purchasePrice"),
        propS.varbPathName("closingCosts"),
        propS.onlyChild("property", "holdingCostTotal"),
        propS.onlyChild("property", "rehabCost"),
        propS.onlyChild("property", "sellingCosts"),
        propS.onlyChild("property", "customUpfrontCosts")
      ),
      buyAndHold: basicsS.sumNums(
        propS.onlyChild("property", "purchasePrice"),
        propS.varbPathName("closingCosts"),
        propS.onlyChild("property", "rehabCost"),
        propS.onlyChild("property", "customUpfrontCosts"),
        propS.onlyChild("mgmt", "customUpfrontCosts")
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
      fixAndFlip: notApplicable(),
      buyAndHold: basicsS.sumNums(
        propS.pathNameBase("propertyFocal", "expensesMonthly"),
        propS.pathNameBase("mgmtFocal", "expensesMonthly"),
        propS.varbPathBase("loanExpensesMonthly")
      ),
    }),
    expensesYearly: dealModeVarb({
      fixAndFlip: notApplicable(),
      buyAndHold: basicsS.sumNums(
        propS.pathNameBase("propertyFocal", "expensesYearly"),
        propS.pathNameBase("mgmtFocal", "expensesYearly"),
        propS.varbPathBase("loanExpensesYearly")
      ),
    }),
    expensesOngoingSwitch: updateVarb("string", {
      initValue: "monthly",
    }),
    cashFlowMonthly: dealModeVarb({
      fixAndFlip: notApplicable(),
      buyAndHold: updateVarbS.leftRightPropFn(
        "simpleSubtract",
        propS.pathNameBase("propertyFocal", "revenueMonthly"),
        propS.local("expensesMonthly")
      ),
    }),
    cashFlowYearly: dealModeVarb({
      fixAndFlip: notApplicable(),
      buyAndHold: updateVarbS.leftRightPropFn(
        "simpleSubtract",
        propS.pathNameBase("propertyFocal", "revenueYearly"),
        propS.local("expensesYearly")
      ),
    }),
    cashFlowOngoingSwitch: updateVarb("string", {
      initValue: "yearly",
    }),
    cocRoiDecimalMonthly: dealModeVarb({
      fixAndFlip: notApplicable(),
      buyAndHold: updateVarbS.leftRightPropFn(
        "divide",
        propS.local("cashFlowMonthly"),
        propS.local("totalInvestment")
      ),
    }),
    cocRoiDecimalYearly: dealModeVarb({
      fixAndFlip: notApplicable(),
      buyAndHold: updateVarbS.leftRightPropFn(
        "divide",
        propS.local("cashFlowYearly"),
        propS.local("totalInvestment")
      ),
    }),
    cocRoiDecimalOngoingSwitch: updateVarb("string", {
      initValue: "yearly",
    }),
    cocRoiMonthly: dealModeVarb({
      fixAndFlip: notApplicable(),
      buyAndHold: updateVarbS.singlePropFn(
        "decimalToPercent",
        propS.local("cocRoiDecimalMonthly")
      ),
    }),
    cocRoiYearly: dealModeVarb({
      fixAndFlip: notApplicable(),
      buyAndHold: updateVarbS.singlePropFn(
        "decimalToPercent",
        propS.local("cocRoiDecimalYearly")
      ),
    }),
    cocRoiOngoingSwitch: updateVarb("string", {
      initValue: "yearly",
    }),
    cashExpensesPlusLoanRepay: dealModeVarb({
      buyAndHold: notApplicable(),
      fixAndFlip: updateVarbS.sumNums([
        propS.local("totalInvestment"),
        propS.varbPathName("loanTotalDollars"),
      ]),
    }),
    totalProfit: dealModeVarb({
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationLR(
        "simpleSubtract",
        propS.onlyChild("property", "afterRepairValue"),
        propS.local("cashExpensesPlusLoanRepay")
      ),
    }),
    roiPercent: dealModeVarb({
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationSimple(
        "decimalToPercent",
        propS.local("roiDecimal")
      ),
    }),
    roiDecimal: dealModeVarb({
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationLR(
        "divide",
        propS.local("totalProfit"),
        propS.local("totalInvestment")
      ),
    }),
    roiPercentPerMonth: dealModeVarb({
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationLR(
        "divide",
        propS.local("roiPercent"),
        propS.onlyChild("property", "holdingPeriodMonths")
      ),
    }),
    roiPercentAnnualized: dealModeVarb({
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
