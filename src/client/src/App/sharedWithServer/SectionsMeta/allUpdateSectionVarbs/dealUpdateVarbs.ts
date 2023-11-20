import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS, uvS } from "../updateSectionVarbs/updateVarb";
import {
  ubS,
  updateBasics,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { upS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { updateOverride } from "../updateSectionVarbs/updateVarb/UpdateOverride";
import { uosS } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { overrideSwitchS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

const notApplicable = () => updateBasics("notApplicable");

const expensesMinusLoanTotal = (
  financingType: "purchaseFinancing" | "refiFinancing"
) => {
  return ubS.equationLR(
    "subtract",
    upS.local("preFinanceOneTimeExpenses"),
    upS.onlyChild(financingType, "loanTotalDollars")
  );
};

function purchasePiti(
  financingName: "purchaseFinancing" | "refiFinancing",
  ending: "Monthly" | "Yearly"
) {
  return ubS.sumNums(
    upS.onlyChild(financingName, `loanPayment${ending}`),
    upS.onlyChild("property", `taxesOngoing${ending}`),
    upS.onlyChild("property", `homeInsOngoing${ending}`),
    upS.onlyChild(financingName, `mortgageIns${ending}`)
  );
}

function nonPrincipal(
  financingName: "purchaseFinancing" | "refiFinancing",
  ending: "Monthly" | "Yearly"
) {
  return ubS.equationLR(
    "subtract",
    upS.local(`expensesOngoing${ending}`),
    upS.onlyChild(financingName, `averagePrincipal${ending}`)
  );
}

function netNonPrincipal(
  financingName: "purchaseFinancing" | "refiFinancing",
  ending: "Monthly" | "Yearly"
) {
  return ubS.equationLR(
    "subtract",
    upS.local(`netExpensesOngoing${ending}`),
    upS.onlyChild(financingName, `averagePrincipal${ending}`)
  );
}

function dealCompletionStatus() {
  return uvS.completionStatusO(
    ...uosS.dealMode({
      homeBuyer: ubS.completionStatus({
        othersValid: [
          upS.onlyChild("property", "completionStatus"),
          upS.onlyChild("purchaseFinancing", "completionStatus"),
        ],
      }),
      buyAndHold: ubS.completionStatus({
        othersValid: [
          upS.onlyChild("property", "completionStatus"),
          upS.onlyChild("purchaseFinancing", "completionStatus"),
          upS.onlyChild("mgmtOngoing", "completionStatus"),
        ],
      }),
      fixAndFlip: ubS.completionStatus({
        othersValid: [
          upS.onlyChild("property", "completionStatus"),
          upS.onlyChild("purchaseFinancing", "completionStatus"),
        ],
      }),
      brrrr: ubS.completionStatus({
        othersValid: [
          upS.onlyChild("property", "completionStatus"),
          upS.onlyChild("purchaseFinancing", "completionStatus"),
          upS.onlyChild("refiFinancing", "completionStatus"),
          upS.onlyChild("mgmtOngoing", "completionStatus"),
        ],
      }),
    })
  );
}

export function dealUpdateVarbs(): UpdateSectionVarbs<"deal"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    ...updateVarbsS.displayNameAndEditor,
    isArchived: updateVarb("boolean", { initValue: false }),
    completionStatus: dealCompletionStatus(),
    dealMode: updateVarb("dealMode", { initValue: "buyAndHold" }),
    ...updateVarbsS.group("netNonPrincipalOngoing", "periodic", "monthly", {
      monthly: uvS.dealMode({
        homeBuyer: netNonPrincipal("purchaseFinancing", "Monthly"),
        buyAndHold: netNonPrincipal("purchaseFinancing", "Monthly"),
        fixAndFlip: ubS.notApplicable,
        brrrr: netNonPrincipal("refiFinancing", "Monthly"),
      }),
      yearly: uvS.dealMode({
        homeBuyer: netNonPrincipal("purchaseFinancing", "Yearly"),
        buyAndHold: netNonPrincipal("purchaseFinancing", "Yearly"),
        fixAndFlip: ubS.notApplicable,
        brrrr: netNonPrincipal("refiFinancing", "Yearly"),
      }),
    }),
    ...updateVarbsS.group("averageNonPrincipalOngoing", "periodic", "monthly", {
      monthly: uvS.dealMode({
        homeBuyer: nonPrincipal("purchaseFinancing", "Monthly"),
        buyAndHold: nonPrincipal("purchaseFinancing", "Monthly"),
        fixAndFlip: ubS.notApplicable,
        brrrr: nonPrincipal("refiFinancing", "Monthly"),
      }),
      yearly: uvS.dealMode({
        homeBuyer: nonPrincipal("purchaseFinancing", "Yearly"),
        buyAndHold: nonPrincipal("purchaseFinancing", "Yearly"),
        fixAndFlip: ubS.notApplicable,
        brrrr: nonPrincipal("refiFinancing", "Yearly"),
      }),
    }),
    ...updateVarbsS.group("ongoingPiti", "periodic", "monthly", {
      monthly: uvS.dealMode({
        homeBuyer: purchasePiti("purchaseFinancing", "Monthly"),
        buyAndHold: purchasePiti("purchaseFinancing", "Monthly"),
        fixAndFlip: ubS.notApplicable,
        brrrr: purchasePiti("refiFinancing", "Monthly"),
      }),
      yearly: uvS.dealMode({
        homeBuyer: purchasePiti("purchaseFinancing", "Yearly"),
        buyAndHold: purchasePiti("purchaseFinancing", "Yearly"),
        fixAndFlip: ubS.notApplicable,
        brrrr: purchasePiti("refiFinancing", "Yearly"),
      }),
    }),
    ...updateVarbsS.group("ongoingLoanPayment", "periodic", "monthly", {
      monthly: uvS.dealMode({
        homeBuyer: ubS.loadFromChild("purchaseFinancing", "loanPaymentMonthly"),
        buyAndHold: ubS.loadFromChild(
          "purchaseFinancing",
          "loanPaymentMonthly"
        ),
        fixAndFlip: ubS.notApplicable,
        brrrr: ubS.loadFromChild("refiFinancing", "loanPaymentMonthly"),
      }),
      yearly: uvS.dealMode({
        homeBuyer: ubS.loadFromChild("purchaseFinancing", "loanPaymentYearly"),
        buyAndHold: ubS.loadFromChild("purchaseFinancing", "loanPaymentYearly"),
        fixAndFlip: ubS.notApplicable,
        brrrr: ubS.loadFromChild("refiFinancing", "loanPaymentYearly"),
      }),
    }),
    ...updateVarbsS.group("timeTillValueAddProfit", "monthsYears", "months", {
      months: uvS.dealMode({
        fixAndFlip: ubS.loadFromChild("property", "holdingPeriodMonths"),
        brrrr: ubS.equationLR(
          "larger",
          upS.onlyChild("property", "holdingPeriodMonths"),
          upS.onlyChild("refiFinancing", "timeTillRefinanceMonths")
        ),
        homeBuyer: ubS.notApplicable,
        buyAndHold: ubS.notApplicable,
      }),
      years: uvS.dealMode({
        fixAndFlip: ubS.loadFromChild("property", "holdingPeriodYears"),
        brrrr: ubS.equationLR(
          "larger",
          upS.onlyChild("property", "holdingPeriodYears"),
          upS.onlyChild("refiFinancing", "timeTillRefinanceYears")
        ),
        homeBuyer: ubS.notApplicable,
        buyAndHold: ubS.notApplicable,
      }),
    }),
    ...updateVarbsS.group("refiLoanHolding", "monthsYears", "months", {
      months: uvS.dealMode({
        brrrr: ubS.equationLR(
          "subtractFloorZero",
          upS.onlyChild("property", "holdingPeriodMonths"),
          upS.onlyChild("refiFinancing", "timeTillRefinanceMonths")
        ),
        fixAndFlip: ubS.notApplicable,
        homeBuyer: ubS.notApplicable,
        buyAndHold: ubS.notApplicable,
      }),
      years: uvS.dealMode({
        brrrr: ubS.equationLR(
          "subtractFloorZero",
          upS.onlyChild("property", "holdingPeriodYears"),
          upS.onlyChild("refiFinancing", "timeTillRefinanceYears")
        ),
        fixAndFlip: ubS.notApplicable,
        homeBuyer: ubS.notApplicable,
        buyAndHold: ubS.notApplicable,
      }),
    }),
    ...updateVarbsS.group("purchaseLoanHolding", "monthsYears", "months", {
      months: uvS.dealMode({
        brrrr: ubS.equationLR(
          "subtract",
          upS.onlyChild("property", "holdingPeriodMonths"),
          upS.local("refiLoanHoldingMonths")
        ),
        fixAndFlip: ubS.loadFromChild("property", "holdingPeriodMonths"),
        homeBuyer: ubS.notApplicable,
        buyAndHold: ubS.notApplicable,
      }),
      years: uvS.dealMode({
        brrrr: ubS.equationLR(
          "subtract",
          upS.onlyChild("property", "holdingPeriodYears"),
          upS.local("refiLoanHoldingYears")
        ),
        fixAndFlip: ubS.loadFromChild("property", "holdingPeriodYears"),
        homeBuyer: ubS.notApplicable,
        buyAndHold: ubS.notApplicable,
      }),
    }),
    purchaseLoanHoldingCost: uvS.dealMode({
      brrrr: updateVarbS.equationLR(
        "multiply",
        upS.onlyChild("purchaseFinancing", "loanPaymentMonthly"),
        upS.local("purchaseLoanHoldingMonths")
      ),
      fixAndFlip: updateVarbS.equationLR(
        "multiply",
        upS.onlyChild("purchaseFinancing", "loanPaymentMonthly"),
        upS.local("purchaseLoanHoldingMonths")
      ),
      homeBuyer: ubS.notApplicable,
      buyAndHold: ubS.notApplicable,
    }),
    refiLoanHoldingCost: uvS.dealMode({
      brrrr: updateVarbS.equationLR(
        "multiply",
        upS.onlyChild("refiFinancing", "loanPaymentMonthly"),
        upS.local("refiLoanHoldingMonths")
      ),
      fixAndFlip: ubS.notApplicable,
      homeBuyer: ubS.notApplicable,
      buyAndHold: ubS.notApplicable,
    }),
    holdingCostTotal: uvS.dealMode({
      homeBuyer: ubS.notApplicable,
      buyAndHold: ubS.notApplicable,
      fixAndFlip: ubS.sumNums(
        upS.onlyChild("property", "holdingCostTotal"),
        upS.local("purchaseLoanHoldingCost")
      ),
      brrrr: ubS.sumNums(
        upS.onlyChild("property", "holdingCostTotal"),
        upS.local("purchaseLoanHoldingCost"),
        upS.local("refiLoanHoldingCost")
      ),
    }),
    preFinanceOneTimeExpenses: uvS.dealMode({
      homeBuyer: ubS.sumNums(
        upS.onlyChild("property", "purchasePrice"),
        upS.onlyChild("property", "rehabCost"),
        upS.onlyChild("purchaseFinancing", "mortgageInsUpfront"),
        upS.onlyChild("purchaseFinancing", "closingCosts")
        // Either keep closing costs and do mortgageIns
        // or add a onetimeCost to financing
      ),
      buyAndHold: ubS.sumNums(
        upS.onlyChild("property", "purchasePrice"),
        upS.onlyChild("property", "rehabCost"),
        upS.onlyChild("purchaseFinancing", "mortgageInsUpfront"),
        upS.onlyChild("purchaseFinancing", "closingCosts"),
        upS.onlyChild("mgmtOngoing", "miscOnetimeCosts")
      ),
      fixAndFlip: ubS.sumNums(
        upS.onlyChild("property", "purchasePrice"),
        upS.onlyChild("property", "rehabCost"),
        upS.onlyChild("purchaseFinancing", "mortgageInsUpfront"),
        upS.onlyChild("purchaseFinancing", "closingCosts"),
        upS.local("holdingCostTotal"),
        upS.onlyChild("property", "sellingCosts")
      ),
      brrrr: ubS.sumNums(
        upS.onlyChild("property", "purchasePrice"),
        upS.onlyChild("property", "rehabCost"),
        upS.onlyChild("purchaseFinancing", "mortgageInsUpfront"),
        upS.onlyChild("purchaseFinancing", "closingCosts"),
        upS.onlyChild("mgmtOngoing", "miscOnetimeCosts"),
        upS.local("holdingCostTotal"),
        upS.onlyChild("refiFinancing", "mortgageInsUpfront"),
        upS.onlyChild("refiFinancing", "closingCosts")
      ),
    }),
    totalInvestment: uvS.dealMode({
      homeBuyer: expensesMinusLoanTotal("purchaseFinancing"),
      buyAndHold: expensesMinusLoanTotal("purchaseFinancing"),
      fixAndFlip: expensesMinusLoanTotal("purchaseFinancing"),
      brrrr: expensesMinusLoanTotal("purchaseFinancing"),
    }),
    expensesOngoingMonthly: uvS.dealMode({
      homeBuyer: ubS.sumNums(
        upS.onlyChild("property", "expensesOngoingMonthly"),
        upS.onlyChild("purchaseFinancing", "loanExpensesMonthly")
      ),
      buyAndHold: ubS.sumNums(
        upS.onlyChild("property", "expensesOngoingMonthly"),
        upS.onlyChild("purchaseFinancing", "loanExpensesMonthly"),
        upS.onlyChild("mgmtOngoing", "expensesMonthly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: ubS.sumNums(
        upS.onlyChild("property", "expensesOngoingMonthly"),
        upS.onlyChild("mgmtOngoing", "expensesMonthly"),
        upS.onlyChild("refiFinancing", "loanExpensesMonthly")
      ),
    }),
    expensesOngoingYearly: uvS.dealMode({
      homeBuyer: ubS.sumNums(
        upS.onlyChild("property", "expensesOngoingYearly"),
        upS.onlyChild("purchaseFinancing", "loanExpensesYearly")
      ),
      buyAndHold: ubS.sumNums(
        upS.onlyChild("property", "expensesOngoingYearly"),
        upS.onlyChild("purchaseFinancing", "loanExpensesYearly"),
        upS.onlyChild("mgmtOngoing", "expensesYearly")
      ),
      fixAndFlip: ubS.notApplicable,
      brrrr: ubS.sumNums(
        upS.onlyChild("property", "expensesOngoingYearly"),
        upS.onlyChild("refiFinancing", "loanExpensesYearly"),
        upS.onlyChild("mgmtOngoing", "expensesYearly")
      ),
    }),
    expensesOngoingPeriodicSwitch: updateVarb("periodic", {
      initValue: "monthly",
    }),
    netExpensesOngoingMonthly: uvS.dealMode({
      homeBuyer: updateVarbS.equationLR(
        "subtract",
        upS.local("expensesOngoingMonthly"),
        upS.onlyChild("property", "revenueOngoingMonthly")
      ),
      buyAndHold: updateVarbS.equationLR(
        "subtract",
        upS.local("expensesOngoingMonthly"),
        upS.onlyChild("property", "revenueOngoingMonthly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: updateVarbS.equationLR(
        "subtract",
        upS.local("expensesOngoingMonthly"),
        upS.onlyChild("property", "revenueOngoingMonthly")
      ),
    }),
    netExpensesOngoingYearly: uvS.dealMode({
      homeBuyer: updateVarbS.equationLR(
        "subtract",
        upS.local("expensesOngoingYearly"),
        upS.onlyChild("property", "revenueOngoingYearly")
      ),
      buyAndHold: updateVarbS.equationLR(
        "subtract",
        upS.local("expensesOngoingYearly"),
        upS.onlyChild("property", "revenueOngoingYearly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: updateVarbS.equationLR(
        "subtract",
        upS.local("expensesOngoingYearly"),
        upS.onlyChild("property", "revenueOngoingYearly")
      ),
    }),
    cashFlowMonthly: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.equationLR(
        "subtract",
        upS.onlyChild("property", "revenueOngoingMonthly"),
        upS.local("expensesOngoingMonthly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: updateVarbS.equationLR(
        "subtract",
        upS.onlyChild("property", "revenueOngoingMonthly"),
        upS.local("expensesOngoingMonthly")
      ),
    }),
    cashFlowYearly: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.equationLR(
        "subtract",
        upS.onlyChild("property", "revenueOngoingYearly"),
        upS.local("expensesOngoingYearly")
      ),
      fixAndFlip: ubS.notApplicable,
      brrrr: updateVarbS.equationLR(
        "subtract",
        upS.onlyChild("property", "revenueOngoingYearly"),
        upS.local("expensesOngoingYearly")
      ),
    }),
    cashFlowPeriodicSwitch: updateVarb("periodic", {
      initValue: "yearly",
    }),
    cocRoiDecimalMonthly: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.equationLR(
        "divide",
        upS.local("cashFlowMonthly"),
        upS.local("totalInvestment")
      ),
      fixAndFlip: ubS.notApplicable,
      brrrr: updateVarbS.equationLR(
        "divide",
        upS.local("cashFlowMonthly"),
        upS.local("totalInvestment")
      ),
    }),
    cocRoiDecimalYearly: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.equationLR(
        "divide",
        upS.local("cashFlowYearly"),
        upS.local("totalInvestment")
      ),
      fixAndFlip: notApplicable(),
      brrrr: updateVarbS.equationLR(
        "divide",
        upS.local("cashFlowYearly"),
        upS.local("totalInvestment")
      ),
    }),
    cocRoiDecimalPeriodicSwitch: updateVarb("periodic", {
      initValue: "yearly",
    }),
    cocRoiMonthly: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.numEquation(
        "decimalToPercent",
        upS.local("cocRoiDecimalMonthly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: updateVarbS.numEquation(
        "decimalToPercent",
        upS.local("cocRoiDecimalMonthly")
      ),
    }),
    cocRoiYearly: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: updateVarbS.numEquation(
        "decimalToPercent",
        upS.local("cocRoiDecimalYearly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: updateVarbS.numEquation(
        "decimalToPercent",
        upS.local("cocRoiDecimalYearly")
      ),
    }),
    cocRoiPeriodicSwitch: updateVarb("periodic", {
      initValue: "yearly",
    }),
    cashCostsPlusPurchaseLoanRepay: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: updateVarbS.equationLR(
        "add",
        upS.local("totalInvestment"),
        upS.onlyChild("purchaseFinancing", "loanTotalDollars")
      ),
      brrrr: updateVarbS.equationLR(
        "add",
        upS.local("totalInvestment"),
        upS.onlyChild("purchaseFinancing", "loanTotalDollars")
      ),
    }),
    valueAddProfit: uvS.dealMode({
      // possibly depreciated
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.equationLR(
        "subtract",
        upS.onlyChild("property", "afterRepairValue"),
        upS.local("preFinanceOneTimeExpenses")
        // this does include selling costs
      ),
      brrrr: ubS.equationLR(
        "subtract",
        upS.onlyChild("property", "afterRepairValue"),
        upS.local("preFinanceOneTimeExpenses")
        // this doesn't include selling costs
      ),
    }),
    valueAddRoiPercent: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.equationSimple(
        "decimalToPercent",
        upS.local("valueAddRoiDecimal")
      ),
      brrrr: ubS.equationSimple(
        "decimalToPercent",
        upS.local("valueAddRoiDecimal")
      ),
    }),
    valueAddRoiDecimal: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.equationLR(
        "divide",
        upS.local("valueAddProfit"),
        upS.local("totalInvestment")
      ),
      brrrr: ubS.equationLR(
        "divide",
        upS.local("valueAddProfit"),
        upS.local("totalInvestment")
      ),
    }),
    valueAddRoiPercentPerMonth: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.equationLR(
        "divide",
        upS.local("valueAddRoiPercent"),
        upS.onlyChild("property", "holdingPeriodMonths")
      ),
      brrrr: ubS.equationLR(
        "divide",
        upS.local("valueAddRoiPercent"),
        upS.local("timeTillValueAddProfitMonths")
      ),
    }),
    valueAddRoiPercentAnnualized: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.equationLR(
        "multiply",
        upS.varbPathName("twelve"),
        upS.local("valueAddRoiPercentPerMonth")
      ),
      brrrr: ubS.equationLR(
        "multiply",
        upS.varbPathName("twelve"),
        upS.local("valueAddRoiPercentPerMonth")
      ),
    }),
    vaProfitOnSale: uvS.dealMode({
      // possibly depreciated
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.loadLocal("valueAddProfit"),
      brrrr: ubS.equationLR(
        "subtract",
        upS.local("valueAddProfit"),
        upS.onlyChild("property", "sellingCosts")
      ),
    }),
    valueAddRoiOnSaleDecimal: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.loadLocal("valueAddRoiDecimal"),
      brrrr: ubS.equationLR(
        "divide",
        upS.local("vaProfitOnSale"),
        upS.local("totalInvestment")
      ),
    }),
    vaRoiOnSalePercent: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.loadLocal("valueAddRoiPercent"),
      brrrr: ubS.equationSimple(
        "decimalToPercent",
        upS.local("valueAddRoiOnSaleDecimal")
      ),
    }),
    valueAddRoiOnSalePercentPerMonth: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.loadLocal("valueAddRoiPercentPerMonth"),
      brrrr: ubS.equationLR(
        "divide",
        upS.local("vaRoiOnSalePercent"),
        upS.local("timeTillValueAddProfitMonths")
      ),
    }),
    vaRoiOnSalePercentAnnualized: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.loadLocal("valueAddRoiPercentAnnualized"),
      brrrr: ubS.equationLR(
        "multiply",
        upS.varbPathName("twelve"),
        upS.local("valueAddRoiOnSalePercentPerMonth")
      ),
    }),

    displayName: updateVarb("stringObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local("displayNameSource", "displayNameEditor")],
          ubS.localStringToStringObj("displayNameEditor")
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
