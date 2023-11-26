import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, uvS } from "../updateSectionVarbs/updateVarb";
import {
  ubS,
  updateBasics,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { upS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { updateOverride } from "../updateSectionVarbs/updateVarb/UpdateOverride";
import { uosS } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { overrideSwitchS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { uvsS } from "../updateSectionVarbs/updateVarbs";

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
    ...uvsS._typeUniformity,
    ...uvsS.savableSection,
    ...uvsS.displayNameAndEditor,
    isArchived: uvS.input("boolean", { initValue: false }),
    completionStatus: dealCompletionStatus(),
    dealMode: uvS.input("dealMode", { initValue: "buyAndHold" }),
    ...uvsS.periodic2("netNonPrincipalOngoing", {
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
    ...uvsS.periodic2("averageNonPrincipalOngoing", {
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
    ...uvsS.periodic2("ongoingPiti", {
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
    ...uvsS.periodic2("ongoingLoanPayment", {
      monthly: uvS.dealMode({
        homeBuyer: ubS.loadChild("purchaseFinancing", "loanPaymentMonthly"),
        buyAndHold: ubS.loadChild("purchaseFinancing", "loanPaymentMonthly"),
        fixAndFlip: ubS.notApplicable,
        brrrr: ubS.loadChild("refiFinancing", "loanPaymentMonthly"),
      }),
      yearly: uvS.dealMode({
        homeBuyer: ubS.loadChild("purchaseFinancing", "loanPaymentYearly"),
        buyAndHold: ubS.loadChild("purchaseFinancing", "loanPaymentYearly"),
        fixAndFlip: ubS.notApplicable,
        brrrr: ubS.loadChild("refiFinancing", "loanPaymentYearly"),
      }),
    }),
    ...uvsS.timespan("timeTillValueAddProfit", {
      months: uvS.dealMode({
        fixAndFlip: ubS.loadChild("property", "holdingPeriodMonths"),
        brrrr: ubS.equationLR(
          "larger",
          upS.onlyChild("property", "holdingPeriodMonths"),
          upS.onlyChild("refiFinancing", "timeTillRefinanceMonths")
        ),
        homeBuyer: ubS.notApplicable,
        buyAndHold: ubS.notApplicable,
      }),
      years: uvS.dealMode({
        fixAndFlip: ubS.loadChild("property", "holdingPeriodYears"),
        brrrr: ubS.equationLR(
          "larger",
          upS.onlyChild("property", "holdingPeriodYears"),
          upS.onlyChild("refiFinancing", "timeTillRefinanceYears")
        ),
        homeBuyer: ubS.notApplicable,
        buyAndHold: ubS.notApplicable,
      }),
    }),
    ...uvsS.timespan("refiLoanHolding", {
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
    ...uvsS.group("purchaseLoanHolding", "monthsYears", "months", {
      months: uvS.dealMode({
        brrrr: ubS.subtract(
          upS.onlyChild("property", "holdingPeriodMonths"),
          "refiLoanHoldingMonths"
        ),
        fixAndFlip: ubS.loadChild("property", "holdingPeriodMonths"),
        homeBuyer: ubS.notApplicable,
        buyAndHold: ubS.notApplicable,
      }),
      years: uvS.dealMode({
        brrrr: ubS.subtract(
          upS.onlyChild("property", "holdingPeriodYears"),
          "refiLoanHoldingYears"
        ),
        fixAndFlip: ubS.loadChild("property", "holdingPeriodYears"),
        homeBuyer: ubS.notApplicable,
        buyAndHold: ubS.notApplicable,
      }),
    }),
    purchaseLoanHoldingCost: uvS.dealMode({
      brrrr: uvS.multiply(
        upS.onlyChild("purchaseFinancing", "loanPaymentMonthly"),
        "purchaseLoanHoldingMonths"
      ),
      fixAndFlip: uvS.multiply(
        upS.onlyChild("purchaseFinancing", "loanPaymentMonthly"),
        "purchaseLoanHoldingMonths"
      ),
      homeBuyer: ubS.notApplicable,
      buyAndHold: ubS.notApplicable,
    }),
    refiLoanHoldingCost: uvS.dealMode({
      brrrr: uvS.multiply(
        upS.onlyChild("refiFinancing", "loanPaymentMonthly"),
        "refiLoanHoldingMonths"
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
        "purchaseLoanHoldingCost"
      ),
      brrrr: ubS.sumNums(
        upS.onlyChild("property", "holdingCostTotal"),
        "purchaseLoanHoldingCost",
        "refiLoanHoldingCost"
      ),
    }),
    preFinanceOneTimeExpenses: uvS.dealMode({
      homeBuyer: ubS.sumNums(
        upS.onlyChild("property", "purchasePrice"),
        upS.onlyChild("property", "rehabCost"),
        upS.onlyChild("purchaseFinancing", "mortgageInsUpfront"),
        upS.onlyChild("purchaseFinancing", "closingCosts")
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
        "holdingCostTotal",
        upS.onlyChild("property", "sellingCosts")
      ),
      brrrr: ubS.sumNums(
        upS.onlyChild("property", "purchasePrice"),
        upS.onlyChild("property", "rehabCost"),
        upS.onlyChild("purchaseFinancing", "mortgageInsUpfront"),
        upS.onlyChild("purchaseFinancing", "closingCosts"),
        upS.onlyChild("mgmtOngoing", "miscOnetimeCosts"),
        "holdingCostTotal",
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
    netExpensesOngoingMonthly: uvS.dealMode({
      homeBuyer: uvS.subtract(
        "expensesOngoingMonthly",
        upS.onlyChild("property", "revenueOngoingMonthly")
      ),
      buyAndHold: uvS.subtract(
        "expensesOngoingMonthly",
        upS.onlyChild("property", "revenueOngoingMonthly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: uvS.subtract(
        "expensesOngoingMonthly",
        upS.onlyChild("property", "revenueOngoingMonthly")
      ),
    }),
    netExpensesOngoingYearly: uvS.dealMode({
      homeBuyer: uvS.subtract(
        "expensesOngoingYearly",
        upS.onlyChild("property", "revenueOngoingYearly")
      ),
      buyAndHold: uvS.subtract(
        "expensesOngoingYearly",
        upS.onlyChild("property", "revenueOngoingYearly")
      ),
      fixAndFlip: notApplicable(),
      brrrr: uvS.subtract(
        "expensesOngoingYearly",
        upS.onlyChild("property", "revenueOngoingYearly")
      ),
    }),
    cashFlowMonthly: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: uvS.subtract(
        upS.onlyChild("property", "revenueOngoingMonthly"),
        "expensesOngoingMonthly"
      ),
      fixAndFlip: notApplicable(),
      brrrr: uvS.subtract(
        upS.onlyChild("property", "revenueOngoingMonthly"),
        "expensesOngoingMonthly"
      ),
    }),
    cashFlowYearly: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: uvS.subtract(
        upS.onlyChild("property", "revenueOngoingYearly"),
        "expensesOngoingYearly"
      ),
      fixAndFlip: ubS.notApplicable,
      brrrr: uvS.subtract(
        upS.onlyChild("property", "revenueOngoingYearly"),
        "expensesOngoingYearly"
      ),
    }),
    cocRoiDecimalMonthly: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: uvS.divide("cashFlowMonthly", "totalInvestment"),
      fixAndFlip: ubS.notApplicable,
      brrrr: uvS.divide("cashFlowMonthly", "totalInvestment"),
    }),
    cocRoiDecimalYearly: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: uvS.divide("cashFlowYearly", "totalInvestment"),
      fixAndFlip: notApplicable(),
      brrrr: uvS.divide("cashFlowYearly", "totalInvestment"),
    }),
    cocRoiDecimalPeriodicSwitch: updateVarb("periodic", {
      initValue: "yearly",
    }),
    cocRoiMonthly: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: uvS.decimalToPercent("cocRoiDecimalMonthly"),
      fixAndFlip: notApplicable(),
      brrrr: uvS.decimalToPercent("cocRoiDecimalMonthly"),
    }),
    cocRoiYearly: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: uvS.decimalToPercent("cocRoiDecimalYearly"),
      fixAndFlip: notApplicable(),
      brrrr: uvS.decimalToPercent("cocRoiDecimalYearly"),
    }),
    cashCostsPlusPurchaseLoanRepay: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: uvS.add(
        "totalInvestment",
        upS.onlyChild("purchaseFinancing", "loanTotalDollars")
      ),
      brrrr: uvS.add(
        "totalInvestment",
        upS.onlyChild("purchaseFinancing", "loanTotalDollars")
      ),
    }),
    valueAddProfit: uvS.dealMode({
      // possibly depreciated
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.subtract(
        upS.onlyChild("property", "afterRepairValue"),
        "preFinanceOneTimeExpenses"
        // this does include selling costs
      ),
      brrrr: ubS.subtract(
        upS.onlyChild("property", "afterRepairValue"),
        "preFinanceOneTimeExpenses"
        // this doesn't include selling costs
      ),
    }),
    valueAddRoiPercent: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.decimalToPercent("valueAddRoiDecimal"),
      brrrr: ubS.decimalToPercent("valueAddRoiDecimal"),
    }),
    valueAddRoiDecimal: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.divide("valueAddProfit", "totalInvestment"),
      brrrr: ubS.divide("valueAddProfit", "totalInvestment"),
    }),
    valueAddRoiPercentPerMonth: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.divide(
        "valueAddRoiPercent",
        upS.onlyChild("property", "holdingPeriodMonths")
      ),
      brrrr: ubS.divide("valueAddRoiPercent", "timeTillValueAddProfitMonths"),
    }),
    valueAddRoiPercentAnnualized: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.multiply(
        upS.varbPathName("twelve"),
        "valueAddRoiPercentPerMonth"
      ),
      brrrr: ubS.multiply(
        upS.varbPathName("twelve"),
        "valueAddRoiPercentPerMonth"
      ),
    }),
    vaProfitOnSale: uvS.dealMode({
      // possibly depreciated
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.loadLocal("valueAddProfit"),
      brrrr: ubS.subtract(
        "valueAddProfit",
        upS.onlyChild("property", "sellingCosts")
      ),
    }),
    valueAddRoiOnSaleDecimal: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.loadLocal("valueAddRoiDecimal"),
      brrrr: ubS.divide("vaProfitOnSale", "totalInvestment"),
    }),
    vaRoiOnSalePercent: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.loadLocal("valueAddRoiPercent"),
      brrrr: ubS.decimalToPercent("valueAddRoiOnSaleDecimal"),
    }),
    valueAddRoiOnSalePercentPerMonth: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.loadLocal("valueAddRoiPercentPerMonth"),
      brrrr: ubS.divide("vaRoiOnSalePercent", "timeTillValueAddProfitMonths"),
    }),
    vaRoiOnSalePercentAnnualized: uvS.dealMode({
      homeBuyer: notApplicable(),
      buyAndHold: notApplicable(),
      fixAndFlip: ubS.loadLocal("valueAddRoiPercentAnnualized"),
      brrrr: ubS.multiply(
        upS.varbPathName("twelve"),
        "valueAddRoiOnSalePercentPerMonth"
      ),
    }),
    displayName: uvS.override("stringObj", [
      updateOverride(
        [overrideSwitchS.local("displayNameSource", "displayNameEditor")],
        ubS.localStringToStringObj("displayNameEditor")
      ),
      updateOverride(
        [overrideSwitchS.local("displayNameSource", "defaultDisplayName")],
        updateBasics("defaultDealDisplayName")
      ),
    ]),
    displayNameSource: updateVarb("dealDisplayNameSource", {
      initValue: "displayNameEditor",
    }),
  } as UpdateSectionVarbs<"deal">;
}
