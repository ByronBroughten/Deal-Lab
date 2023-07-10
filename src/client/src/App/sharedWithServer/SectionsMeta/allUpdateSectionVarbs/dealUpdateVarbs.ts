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

function nonPrincipal(
  financingName: "purchaseFinancing" | "refiFinancing",
  ending: "Monthly" | "Yearly"
) {
  return basicsS.equationLR(
    "subtract",
    propS.local(`expensesOngoing${ending}`),
    propS.onlyChild(financingName, `averagePrincipal${ending}`)
  );
}

export function dealUpdateVarbs(): UpdateSectionVarbs<"deal"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    ...updateVarbsS.displayNameAndEditor,
    isArchived: updateVarb("boolean", { initValue: false }),
    completionStatus: dealCompletionStatus,
    dealMode: updateVarb("dealMode", { initValue: "buyAndHold" }),
    ...updateVarbsS.group("averageNonPrincipalOngoing", "periodic", "monthly", {
      monthly: dealModeVarb({
        homeBuyer: nonPrincipal("purchaseFinancing", "Monthly"),
        buyAndHold: nonPrincipal("purchaseFinancing", "Monthly"),
        fixAndFlip: basicsS.notApplicable,
        brrrr: nonPrincipal("refiFinancing", "Monthly"),
      }),
      yearly: dealModeVarb({
        homeBuyer: nonPrincipal("purchaseFinancing", "Yearly"),
        buyAndHold: nonPrincipal("purchaseFinancing", "Yearly"),
        fixAndFlip: basicsS.notApplicable,
        brrrr: nonPrincipal("refiFinancing", "Yearly"),
      }),
    }),
    ...updateVarbsS.group("ongoingPiti", "periodic", "monthly", {
      monthly: dealModeVarb({
        homeBuyer: purchasePiti("purchaseFinancing", "Monthly"),
        buyAndHold: purchasePiti("purchaseFinancing", "Monthly"),
        fixAndFlip: basicsS.notApplicable,
        brrrr: purchasePiti("refiFinancing", "Monthly"),
      }),
      yearly: dealModeVarb({
        homeBuyer: purchasePiti("purchaseFinancing", "Yearly"),
        buyAndHold: purchasePiti("purchaseFinancing", "Yearly"),
        fixAndFlip: basicsS.notApplicable,
        brrrr: purchasePiti("refiFinancing", "Yearly"),
      }),
    }),
    ...updateVarbsS.group("ongoingLoanPayment", "periodic", "monthly", {
      monthly: dealModeVarb({
        homeBuyer: basicsS.loadFromChild(
          "purchaseFinancing",
          "loanPaymentMonthly"
        ),
        buyAndHold: basicsS.loadFromChild(
          "purchaseFinancing",
          "loanPaymentMonthly"
        ),
        fixAndFlip: basicsS.notApplicable,
        brrrr: basicsS.loadFromChild("refiFinancing", "loanPaymentMonthly"),
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
        fixAndFlip: basicsS.notApplicable,
        brrrr: basicsS.loadFromChild("refiFinancing", "loanPaymentYearly"),
      }),
    }),
    ...updateVarbsS.group("timeTillValueAddProfit", "monthsYears", "months", {
      months: dealModeVarb({
        fixAndFlip: basicsS.loadFromChild("property", "holdingPeriodMonths"),
        brrrr: basicsS.equationLR(
          "larger",
          propS.onlyChild("property", "holdingPeriodMonths"),
          propS.onlyChild("refiFinancing", "timeTillRefinanceMonths")
        ),
        homeBuyer: basicsS.notApplicable,
        buyAndHold: basicsS.notApplicable,
      }),
      years: dealModeVarb({
        fixAndFlip: basicsS.loadFromChild("property", "holdingPeriodYears"),
        brrrr: basicsS.equationLR(
          "larger",
          propS.onlyChild("property", "holdingPeriodYears"),
          propS.onlyChild("refiFinancing", "timeTillRefinanceYears")
        ),
        homeBuyer: basicsS.notApplicable,
        buyAndHold: basicsS.notApplicable,
      }),
    }),
    ...updateVarbsS.group("refiLoanHolding", "monthsYears", "months", {
      months: dealModeVarb({
        brrrr: basicsS.equationLR(
          "subtractFloorZero",
          propS.onlyChild("property", "holdingPeriodMonths"),
          propS.onlyChild("refiFinancing", "timeTillRefinanceMonths")
        ),
        fixAndFlip: basicsS.notApplicable,
        homeBuyer: basicsS.notApplicable,
        buyAndHold: basicsS.notApplicable,
      }),
      years: dealModeVarb({
        brrrr: basicsS.equationLR(
          "subtractFloorZero",
          propS.onlyChild("property", "holdingPeriodYears"),
          propS.onlyChild("refiFinancing", "timeTillRefinanceYears")
        ),
        fixAndFlip: basicsS.notApplicable,
        homeBuyer: basicsS.notApplicable,
        buyAndHold: basicsS.notApplicable,
      }),
    }),
    ...updateVarbsS.group("purchaseLoanHolding", "monthsYears", "months", {
      months: dealModeVarb({
        brrrr: basicsS.equationLR(
          "subtract",
          propS.onlyChild("property", "holdingPeriodMonths"),
          propS.local("refiLoanHoldingMonths")
        ),
        fixAndFlip: basicsS.loadFromChild("property", "holdingPeriodMonths"),
        homeBuyer: basicsS.notApplicable,
        buyAndHold: basicsS.notApplicable,
      }),
      years: dealModeVarb({
        brrrr: basicsS.equationLR(
          "subtract",
          propS.onlyChild("property", "holdingPeriodYears"),
          propS.local("refiLoanHoldingYears")
        ),
        fixAndFlip: basicsS.loadFromChild("property", "holdingPeriodYears"),
        homeBuyer: basicsS.notApplicable,
        buyAndHold: basicsS.notApplicable,
      }),
    }),
    purchaseLoanHoldingCost: dealModeVarb({
      brrrr: updateVarbS.equationLR(
        "multiply",
        propS.onlyChild("purchaseFinancing", "loanPaymentMonthly"),
        propS.local("purchaseLoanHoldingMonths")
      ),
      fixAndFlip: updateVarbS.equationLR(
        "multiply",
        propS.onlyChild("purchaseFinancing", "loanPaymentMonthly"),
        propS.local("purchaseLoanHoldingMonths")
      ),
      homeBuyer: basicsS.notApplicable,
      buyAndHold: basicsS.notApplicable,
    }),
    refiLoanHoldingCost: dealModeVarb({
      brrrr: updateVarbS.equationLR(
        "multiply",
        propS.onlyChild("refiFinancing", "loanPaymentMonthly"),
        propS.local("refiLoanHoldingMonths")
      ),
      fixAndFlip: basicsS.notApplicable,
      homeBuyer: basicsS.notApplicable,
      buyAndHold: basicsS.notApplicable,
    }),
    holdingCostTotal: dealModeVarb({
      homeBuyer: basicsS.notApplicable,
      buyAndHold: basicsS.notApplicable,
      fixAndFlip: basicsS.sumNums(
        propS.onlyChild("property", "holdingCostTotal"),
        propS.local("purchaseLoanHoldingCost")
      ),
      brrrr: basicsS.sumNums(
        propS.onlyChild("property", "holdingCostTotal"),
        propS.local("purchaseLoanHoldingCost"),
        propS.local("refiLoanHoldingCost")
      ),
    }),
    preFinanceOneTimeExpenses: dealModeVarb({
      homeBuyer: basicsS.sumNums(
        propS.onlyChild("property", "purchasePrice"),
        propS.onlyChild("property", "rehabCost"),
        propS.onlyChild("purchaseFinancing", "mortgageInsUpfront"),
        propS.onlyChild("purchaseFinancing", "closingCosts")
        // Either keep closing costs and do mortgageIns
        // or add a onetimeCost to financing
      ),
      buyAndHold: basicsS.sumNums(
        propS.onlyChild("property", "purchasePrice"),
        propS.onlyChild("property", "rehabCost"),
        propS.onlyChild("purchaseFinancing", "mortgageInsUpfront"),
        propS.onlyChild("purchaseFinancing", "closingCosts"),
        propS.onlyChild("mgmtOngoing", "miscOnetimeCosts")
      ),
      fixAndFlip: basicsS.sumNums(
        propS.onlyChild("property", "purchasePrice"),
        propS.onlyChild("property", "rehabCost"),
        propS.onlyChild("purchaseFinancing", "mortgageInsUpfront"),
        propS.onlyChild("purchaseFinancing", "closingCosts"),
        propS.local("holdingCostTotal"),
        propS.onlyChild("property", "sellingCosts")
      ),
      brrrr: basicsS.sumNums(
        propS.onlyChild("property", "purchasePrice"),
        propS.onlyChild("property", "rehabCost"),
        propS.onlyChild("purchaseFinancing", "mortgageInsUpfront"),
        propS.onlyChild("purchaseFinancing", "closingCosts"),
        propS.onlyChild("mgmtOngoing", "miscOnetimeCosts"),
        propS.local("holdingCostTotal"),
        propS.onlyChild("refiFinancing", "mortgageInsUpfront"),
        propS.onlyChild("refiFinancing", "closingCosts")
      ),
    }),
    totalInvestment: dealModeVarb({
      homeBuyer: expensesMinusLoanTotal("purchaseFinancing"),
      buyAndHold: expensesMinusLoanTotal("purchaseFinancing"),
      fixAndFlip: expensesMinusLoanTotal("purchaseFinancing"),
      brrrr: expensesMinusLoanTotal("purchaseFinancing"),
    }),
    expensesOngoingMonthly: dealModeVarb({
      homeBuyer: basicsS.sumNums(
        propS.onlyChild("property", "expensesOngoingMonthly"),
        propS.onlyChild("purchaseFinancing", "loanExpensesMonthly")
      ),
      buyAndHold: basicsS.sumNums(
        propS.onlyChild("property", "expensesOngoingMonthly"),
        propS.onlyChild("mgmtOngoing", "expensesMonthly"),
        propS.onlyChild("purchaseFinancing", "loanExpensesMonthly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: basicsS.sumNums(
        propS.onlyChild("property", "expensesOngoingMonthly"),
        propS.onlyChild("mgmtOngoing", "expensesMonthly"),
        propS.onlyChild("refiFinancing", "loanExpensesMonthly")
      ),
    }),
    expensesOngoingYearly: dealModeVarb({
      homeBuyer: basicsS.sumNums(
        propS.onlyChild("property", "expensesOngoingYearly"),
        propS.onlyChild("purchaseFinancing", "loanExpensesYearly")
      ),
      buyAndHold: basicsS.sumNums(
        propS.onlyChild("property", "expensesOngoingYearly"),
        propS.onlyChild("mgmtOngoing", "expensesYearly"),
        propS.onlyChild("purchaseFinancing", "loanExpensesYearly")
      ),
      fixAndFlip: basicsS.notApplicable,
      brrrr: basicsS.sumNums(
        propS.onlyChild("property", "expensesOngoingYearly"),
        propS.onlyChild("mgmtOngoing", "expensesYearly"),
        propS.onlyChild("refiFinancing", "loanExpensesYearly")
      ),
    }),
    expensesOngoingPeriodicSwitch: updateVarb("ongoingSwitch", {
      initValue: "monthly",
    }),
    cashFlowMonthly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.equationLR(
        "subtract",
        propS.onlyChild("property", "revenueOngoingMonthly"),
        propS.local("expensesOngoingMonthly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: updateVarbS.equationLR(
        "subtract",
        propS.onlyChild("property", "revenueOngoingMonthly"),
        propS.local("expensesOngoingMonthly")
      ),
    }),
    cashFlowYearly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.equationLR(
        "subtract",
        propS.onlyChild("property", "revenueOngoingYearly"),
        propS.local("expensesOngoingYearly")
      ),
      fixAndFlip: basicsS.notApplicable,
      brrrr: updateVarbS.equationLR(
        "subtract",
        propS.onlyChild("property", "revenueOngoingYearly"),
        propS.local("expensesOngoingYearly")
      ),
    }),
    cashFlowPeriodicSwitch: updateVarb("ongoingSwitch", {
      initValue: "yearly",
    }),
    cocRoiDecimalMonthly: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.equationLR(
        "divide",
        propS.local("cashFlowMonthly"),
        propS.local("totalInvestment")
      ),
      fixAndFlip: basicsS.notApplicable,
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
    cocRoiDecimalPeriodicSwitch: updateVarb("ongoingSwitch", {
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
    cocRoiPeriodicSwitch: updateVarb("ongoingSwitch", {
      initValue: "yearly",
    }),
    cashCostsPlusPurchaseLoanRepay: dealModeVarb({
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
    totalEquityProfit: dealModeVarb({
      // possibly depreciated
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationLR(
        "subtract",
        propS.onlyChild("property", "afterRepairValue"),
        propS.local("preFinanceOneTimeExpenses")
      ),
      brrrr: basicsS.equationLR(
        "subtract",
        propS.onlyChild("refiFinancing", "loanTotalDollars"),
        propS.local("preFinanceOneTimeExpenses")
      ),
    }),
    valueAddRoiPercent: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationSimple(
        "decimalToPercent",
        propS.local("valueAddRoiDecimal")
      ),
      brrrr: basicsS.equationSimple(
        "decimalToPercent",
        propS.local("valueAddRoiDecimal")
      ),
    }),
    valueAddRoiDecimal: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationLR(
        "divide",
        propS.local("totalEquityProfit"),
        propS.local("totalInvestment")
      ),
      brrrr: basicsS.equationLR(
        "divide",
        propS.local("totalEquityProfit"),
        propS.local("totalInvestment")
      ),
    }),
    valueAddRoiPercentPerMonth: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationLR(
        "divide",
        propS.local("valueAddRoiPercent"),
        propS.onlyChild("property", "holdingPeriodMonths")
      ),
      brrrr: basicsS.equationLR(
        "divide",
        propS.local("valueAddRoiPercent"),
        propS.local("timeTillValueAddProfitMonths")
      ),
    }),
    valueAddRoiPercentAnnualized: dealModeVarb({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: basicsS.equationLR(
        "multiply",
        propS.varbPathName("twelve"),
        propS.local("valueAddRoiPercentPerMonth")
      ),
      brrrr: basicsS.equationLR(
        "multiply",
        propS.varbPathName("twelve"),
        propS.local("valueAddRoiPercentPerMonth")
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
