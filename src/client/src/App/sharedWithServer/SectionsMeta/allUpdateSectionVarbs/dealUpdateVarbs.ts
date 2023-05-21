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

const expensesMinusLoanTotal = (
  financingType: "purchaseFinancing" | "refiFinancing"
) => {
  return basicsS.equationLR(
    "subtract",
    propS.local("preFinanceOneTimeExpenses"),
    propS.onlyChild(financingType, "loanTotalDollars")
  );
};

function purchasePiti(
  financingName: "purchaseFinancing" | "refiFinancing",
  ending: "Monthly" | "Yearly"
) {
  return basicsS.sumNums(
    propS.onlyChild(financingName, `loanPayment${ending}`),
    propS.onlyChild("property", `taxesOngoing${ending}`),
    propS.onlyChild("property", `homeInsOngoing${ending}`),
    propS.onlyChild(financingName, `mortgageIns${ending}`)
  );
}

export function dealUpdateVarbs(): UpdateSectionVarbs<"deal"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    ...updateVarbsS.displayNameAndEditor,
    completionStatus: dealCompletionStatus,
    dealMode: updateVarb("dealMode", { initValue: "buyAndHold" }),
    ...updateVarbsS.group("ongoingPiti", "ongoing", "monthly", {
      monthly: dealModeVarb({
        homeBuyer: purchasePiti("purchaseFinancing", "Monthly"),
        buyAndHold: purchasePiti("purchaseFinancing", "Monthly"),
        fixAndFlip: purchasePiti("purchaseFinancing", "Monthly"),
        brrrr: purchasePiti("refiFinancing", "Monthly"),
      }),
      yearly: dealModeVarb({
        homeBuyer: purchasePiti("purchaseFinancing", "Yearly"),
        buyAndHold: purchasePiti("purchaseFinancing", "Yearly"),
        fixAndFlip: purchasePiti("purchaseFinancing", "Yearly"),
        brrrr: purchasePiti("refiFinancing", "Yearly"),
      }),
    }),
    ...updateVarbsS.group("ongoingLoanPayment", "ongoing", "monthly", {
      monthly: dealModeVarb({
        homeBuyer: basicsS.loadFromChild(
          "purchaseFinancing",
          "loanPaymentMonthly"
        ),
        buyAndHold: basicsS.loadFromChild(
          "purchaseFinancing",
          "loanPaymentMonthly"
        ),
        fixAndFlip: basicsS.loadFromChild(
          "purchaseFinancing",
          "loanPaymentMonthly"
        ),
        brrrr: basicsS.loadFromChild("purchaseFinancing", "loanPaymentMonthly"),
      }),
      yearly: dealModeVarb({
        homeBuyer: basicsS.loadFromChild(
          "purchaseFinancing",
          "loanPaymentYearly"
        ),
        buyAndHold: basicsS.loadFromChild(
          "purchaseFinancing",
          "loanPaymentYearly"
        ),
        fixAndFlip: basicsS.loadFromChild(
          "purchaseFinancing",
          "loanPaymentYearly"
        ),
        brrrr: basicsS.loadFromChild("purchaseFinancing", "loanPaymentYearly"),
      }),
    }),
    ...updateVarbsS.group("refiLoanHolding", "monthsYears", "months", {
      months: basicsS.equationLR(
        "subtractOffsetNegative",
        propS.onlyChild("property", "holdingPeriodMonths"),
        propS.onlyChild("refiFinancing", "timeTillRefinanceMonths")
      ),
      years: basicsS.equationLR(
        "subtractOffsetNegative",
        propS.onlyChild("property", "holdingPeriodYears"),
        propS.onlyChild("refiFinancing", "timeTillRefinanceYears")
      ),
    }),
    ...updateVarbsS.group("purchaseLoanHolding", "monthsYears", "months", {
      months: basicsS.equationLR(
        "subtract",
        propS.onlyChild("property", "holdingPeriodMonths"),
        propS.local("refiLoanHoldingMonths")
      ),
      years: basicsS.equationLR(
        "subtract",
        propS.onlyChild("property", "holdingPeriodYears"),
        propS.local("refiLoanHoldingYears")
      ),
    }),
    holdingPurchaseLoanPayment: updateVarbS.equationLR(
      "multiply",
      propS.onlyChild("purchaseFinancing", "loanPaymentMonthly"),
      propS.local("purchaseLoanHoldingMonths")
    ),

    holdingRefiLoanPayment: updateVarbS.equationLR(
      "multiply",
      propS.onlyChild("refiFinancing", "loanPaymentMonthly"),
      propS.local("refiLoanHoldingMonths")
    ),

    totalHoldingLoanPayment: dealModeVarb({
      homeBuyer: basicsS.notApplicable,
      buyAndHold: basicsS.notApplicable,
      fixAndFlip: basicsS.loadFromLocal("holdingPurchaseLoanPayment"),
      brrrr: basicsS.equationLR(
        "add",
        propS.local("holdingPurchaseLoanPayment"),
        propS.local("holdingRefiLoanPayment")
      ),
    }),
    allClosingCosts: dealModeVarb({
      homeBuyer: basicsS.loadFromChild("purchaseFinancing", "closingCosts"),
      buyAndHold: basicsS.loadFromChild("purchaseFinancing", "closingCosts"),
      fixAndFlip: basicsS.loadFromChild("purchaseFinancing", "closingCosts"),
      brrrr: basicsS.sumNums(
        propS.onlyChild("purchaseFinancing", "closingCosts"),
        propS.onlyChild("refiFinancing", "closingCosts")
      ),
    }),
    preFinanceOneTimeExpenses: dealModeVarb({
      homeBuyer: basicsS.sumNums(
        propS.onlyChild("property", "purchasePrice"),
        propS.local("allClosingCosts"),
        propS.onlyChild("property", "rehabCost"),
        propS.onlyChild("property", "miscOnetimeCosts")
      ),
      buyAndHold: basicsS.sumNums(
        propS.onlyChild("property", "purchasePrice"),
        propS.local("allClosingCosts"),
        propS.onlyChild("property", "rehabCost"),
        propS.onlyChild("property", "miscOnetimeCosts"),
        propS.onlyChild("mgmt", "miscOnetimeCosts")
      ),
      fixAndFlip: basicsS.sumNums(
        propS.onlyChild("property", "purchasePrice"),
        propS.onlyChild("property", "holdingCostTotal"),
        propS.onlyChild("property", "rehabCost"),
        propS.onlyChild("property", "sellingCosts"),
        propS.onlyChild("property", "miscOnetimeCosts"),
        propS.local("allClosingCosts"),
        propS.local("totalHoldingLoanPayment")
      ),
      brrrr: basicsS.sumNums(
        propS.onlyChild("property", "purchasePrice"),
        propS.onlyChild("property", "rehabCost"),
        propS.onlyChild("property", "miscOnetimeCosts"),
        propS.onlyChild("property", "holdingCostTotal"),
        propS.onlyChild("mgmt", "miscOnetimeCosts"),
        propS.local("allClosingCosts"),
        propS.local("totalHoldingLoanPayment")
      ),
    }),
    totalInvestment: dealModeVarb({
      homeBuyer: expensesMinusLoanTotal("purchaseFinancing"),
      buyAndHold: expensesMinusLoanTotal("purchaseFinancing"),
      fixAndFlip: expensesMinusLoanTotal("purchaseFinancing"),
      brrrr: expensesMinusLoanTotal("refiFinancing"),
    }),
    expensesMonthly: dealModeVarb({
      homeBuyer: basicsS.sumNums(
        propS.onlyChild("property", "expensesMonthly"),
        propS.onlyChild("purchaseFinancing", "loanExpensesMonthly")
      ),
      buyAndHold: basicsS.sumNums(
        propS.onlyChild("property", "expensesMonthly"),
        propS.onlyChild("mgmt", "expensesMonthly"),
        propS.onlyChild("purchaseFinancing", "loanExpensesMonthly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: basicsS.sumNums(
        propS.onlyChild("property", "expensesMonthly"),
        propS.onlyChild("mgmt", "expensesMonthly"),
        propS.onlyChild("refiFinancing", "loanExpensesMonthly")
      ),
    }),
    expensesYearly: dealModeVarb({
      homeBuyer: basicsS.sumNums(
        propS.onlyChild("property", "expensesYearly"),
        propS.onlyChild("purchaseFinancing", "loanExpensesYearly")
      ),
      buyAndHold: basicsS.sumNums(
        propS.onlyChild("property", "expensesYearly"),
        propS.onlyChild("mgmt", "expensesYearly"),
        propS.onlyChild("purchaseFinancing", "loanExpensesYearly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: basicsS.sumNums(
        propS.onlyChild("property", "expensesYearly"),
        propS.onlyChild("mgmt", "expensesYearly"),
        propS.onlyChild("refiFinancing", "loanExpensesYearly")
      ),
    }),
    expensesOngoingSwitch: updateVarb("ongoingSwitch", {
      initValue: "monthly",
    }),
    cashFlowMonthly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.equationLR(
        "subtract",
        propS.onlyChild("property", "revenueMonthly"),
        propS.local("expensesMonthly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: updateVarbS.equationLR(
        "subtract",
        propS.onlyChild("property", "revenueMonthly"),
        propS.local("expensesMonthly")
      ),
    }),
    cashFlowYearly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.equationLR(
        "subtract",
        propS.onlyChild("property", "revenueYearly"),
        propS.local("expensesYearly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: updateVarbS.equationLR(
        "subtract",
        propS.onlyChild("property", "revenueYearly"),
        propS.local("expensesYearly")
      ),
    }),
    cashFlowOngoingSwitch: updateVarb("ongoingSwitch", {
      initValue: "yearly",
    }),
    cocRoiDecimalMonthly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.equationLR(
        "divide",
        propS.local("cashFlowMonthly"),
        propS.local("totalInvestment")
      ),
      fixAndFlip: notApplicable(),
      brrrr: updateVarbS.equationLR(
        "divide",
        propS.local("cashFlowMonthly"),
        propS.local("totalInvestment")
      ),
    }),
    cocRoiDecimalYearly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.equationLR(
        "divide",
        propS.local("cashFlowYearly"),
        propS.local("totalInvestment")
      ),
      fixAndFlip: notApplicable(),
      brrrr: updateVarbS.equationLR(
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
      fixAndFlip: updateVarbS.equationLR(
        "add",
        propS.local("totalInvestment"),
        propS.onlyChild("purchaseFinancing", "loanTotalDollars")
      ),

      brrrr: updateVarbS.equationLR(
        "add",
        propS.local("totalInvestment"),
        propS.onlyChild("purchaseFinancing", "loanTotalDollars")
      ),
    }),
    totalProfit: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationLR(
        "subtract",
        propS.onlyChild("property", "afterRepairValue"),
        propS.local("cashExpensesPlusLoanRepay")
      ),
      brrrr: basicsS.equationLR(
        "subtract",
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
  } as UpdateSectionVarbs<"deal">;
}
