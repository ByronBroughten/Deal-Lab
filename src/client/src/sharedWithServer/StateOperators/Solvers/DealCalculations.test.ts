import { switchKeyToVarbNames } from "../../stateSchemas/allBaseSectionVarbs/baseSwitchNames";
import { VarbName } from "../../stateSchemas/derivedFromBaseSchemas/baseSectionsVarbsTypes";
import { ChildName } from "../../stateSchemas/derivedFromChildrenSchemas/ChildName";
import {
  DealMode,
  dealModes,
  isDealMode,
} from "../../stateSchemas/StateValue/dealMode";
import { numObj, NumObjOutput } from "../../stateSchemas/StateValue/NumObj";
import { roundS } from "../../stateSchemas/StateValue/stateValuesShared/calculations/numUnitParams";
import { mathS, validateNumber } from "../../utils/math";
import { StrictExtract } from "../../utils/types";
import { SolverActiveDeal } from "./SolverActiveDeal";
import { SolverSection } from "./SolverSection";
import {
  addHoldingTaxesHomeInsYearly,
  addOngoingTaxesHomeInsYearly,
  setLoanValues,
  setOnetimeEditor,
  setPeriodicEditor,
} from "./testUtils";

const refiHoldingSpan = (
  dealMode: DealMode,
  holdingMonths: number,
  monthsTillRefi: number
) => {
  if (isDealMode(dealMode, "hasRefi")) {
    if (holdingMonths < monthsTillRefi) {
      return 0;
    } else {
      return holdingMonths - monthsTillRefi;
    }
  }
  return "N/A";
};

const purchaseHoldingSpan = (
  dealMode: DealMode,
  holdingMonths: number,
  monthsTillRefi: number
): NumObjOutput => {
  const refiSpan = refiHoldingSpan(dealMode, holdingMonths, monthsTillRefi);
  if (dealMode === "fixAndFlip") {
    return holdingMonths;
  } else if (dealMode === "brrrr") {
    if (!(typeof refiSpan === "number")) {
      throw new Error(`dealMode is ${dealMode}, but refiSpan is not a number`);
    }
    return holdingMonths - refiSpan;
  }
  return "N/A";
};

function purchaseLoanHoldingCost(
  dealMode: DealMode,
  holdingMonths: number,
  monthsTillRefi: number,
  loanPaymentMonthly: number
): NumObjOutput {
  let purchaseHoldMonths = purchaseHoldingSpan(
    dealMode,
    holdingMonths,
    monthsTillRefi
  );

  if (isDealMode(dealMode, "hasHolding")) {
    purchaseHoldMonths = validateNumber(purchaseHoldMonths);
    return loanPaymentMonthly * purchaseHoldMonths;
  } else return "N/A";
}

function refiLoanHoldingCost(
  dealMode: DealMode,
  holdingMonths: number,
  monthsTillRefi: number,
  loanPaymentMonthly: number
): NumObjOutput {
  let refiHoldMonths = refiHoldingSpan(dealMode, holdingMonths, monthsTillRefi);

  if (dealMode === "brrrr") {
    refiHoldMonths = validateNumber(refiHoldMonths);
    return loanPaymentMonthly * refiHoldMonths;
  }
  return "N/A";
}

function holdingCostTotal(
  dealMode: DealMode,
  holdingMonths: number,
  monthsTillRefi: number,
  propertyHoldCost: number,
  purchasePaymentM: number,
  refiPaymentM: number
) {
  let purchaseHoldCost = purchaseLoanHoldingCost(
    dealMode,
    holdingMonths,
    monthsTillRefi,
    purchasePaymentM
  );

  let refiHoldCost = refiLoanHoldingCost(
    dealMode,
    holdingMonths,
    monthsTillRefi,
    refiPaymentM
  );

  if (dealMode === "brrrr") {
    purchaseHoldCost = validateNumber(purchaseHoldCost);
    refiHoldCost = validateNumber(refiHoldCost);
    return roundS.cents(propertyHoldCost + purchaseHoldCost + refiHoldCost);
  } else if (dealMode === "fixAndFlip") {
    purchaseHoldCost = validateNumber(purchaseHoldCost);
    return roundS.cents(propertyHoldCost + purchaseHoldCost);
  } else {
    return "N/A";
  }
}

const getProfit = (
  dealMode: DealMode,
  repay: number,
  arv: number
): NumObjOutput => {
  if (dealMode === "fixAndFlip") {
    return roundS.cents(arv - repay);
  } else if (dealMode === "brrrr") {
    return roundS.cents(arv - repay);
  } else {
    return "N/A";
  }
};

const ongoingLoanPayment = (
  purchasePayment: number,
  refiPayment: number
): Record<DealMode, NumObjOutput> => {
  return {
    homeBuyer: purchasePayment,
    buyAndHold: purchasePayment,
    fixAndFlip: "N/A",
    brrrr: refiPayment,
  };
};

describe("DealCalculations", () => {
  let activeDeal: SolverActiveDeal;
  let deal: SolverSection<"deal">;
  let property: SolverSection<"property">;
  let purchaseFinancing: SolverSection<"financing">;
  let refiFinancing: SolverSection<"financing">;
  let firstPurchaseLoan: SolverSection<"loan">;
  let firstRefiLoan: SolverSection<"loan">;
  let mgmt: SolverSection<"mgmt">;

  beforeEach(() => {
    activeDeal = SolverActiveDeal.init("homeBuyer");
    deal = activeDeal.solver;
    property = activeDeal.property;
    purchaseFinancing = activeDeal.purchaseFinancing;
    purchaseFinancing.updateValues({ financingMethod: "useLoan" });
    firstPurchaseLoan = purchaseFinancing.onlyChild("loan");
    refiFinancing = activeDeal.refiFinancing;
    firstRefiLoan = refiFinancing.onlyChild("loan");
    mgmt = activeDeal.mgmt;
  });

  const setHoldingAndTillRefiMonths = (
    holdingMonths: number,
    monthsTillRefi: number
  ) => {
    const holdingPeriod = property.onlyChild("holdingPeriod");
    holdingPeriod.updateValues({
      valueEditor: numObj(holdingMonths),
      valueEditorUnit: "months",
    });
    refiFinancing.onlyChild("timeTillRefinance").updateValues({
      valueEditor: numObj(monthsTillRefi),
      valueEditorUnit: "months",
    });
  };

  const perDealModeDeal = (doWhat: (dealMode: DealMode) => void) => {
    for (const dealMode of dealModes) {
      activeDeal.changeDealMode(dealMode);
      doWhat(dealMode);
    }
  };

  const testVarb = (
    varbName: VarbName<"deal">,
    num: NumObjOutput,
    showExtra?: string
  ) => {
    expect(`${showExtra ?? ""}${deal.numOutput(varbName)}`).toBe(
      `${showExtra ?? ""}${num}`
    );
  };

  type BaseName =
    | "expensesOngoing"
    | "averageNonPrincipalOngoing"
    | "cashFlow"
    | "cocRoi"
    | "ongoingLoanPayment"
    | "ongoingPiti";

  const testPeriodicVarb = (baseName: BaseName, num: NumObjOutput) => {
    const varbNames = switchKeyToVarbNames(baseName, "periodic");
    expect(deal.numOutput(varbNames.monthly)).toBe(num);

    const yearly = deal.numOutput(varbNames.yearly);
    if (typeof num === "number") {
      expect(yearly).toBeCloseTo(num * 12, 1);
    } else {
      expect(yearly).toBe(num);
    }
  };

  const testSpanVarb = (
    baseName:
      | "purchaseLoanHolding"
      | "refiLoanHolding"
      | "timeTillValueAddProfit",
    num: NumObjOutput
  ) => {
    const varbNames = switchKeyToVarbNames(baseName, "monthsYears");
    expect(deal.numOutput(varbNames.months)).toBe(num);
    expect(deal.numOutput(varbNames.years)).toBe(
      typeof num === "number" ? roundS.decimal(num / 12) : num
    );
  };

  const setPreFinanceOnetimeExpenses = (
    purchaseLoanAmount: number = 80000,
    refiLoanAmount: number = 100000
  ): Record<DealMode, number> => {
    const purchasePrice = 100000;
    const rehabCost = 500;
    const miscOnetimeCost = 700;
    const sellingCost = 10000;

    const taxesYearly = 2400;
    const homeInsYearly = 1200;
    const propertyHoldingCost = taxesYearly + homeInsYearly;

    const purchaseClosing = 5000;
    const refiClosing = 6000;
    const purchaseMortIns = 1000;
    const refiMortIns = 2000;

    const mgmtUpfront = 1300;
    const holdingMonths = 12;
    const monthsTillRefi = 12;

    setHoldingAndTillRefiMonths(holdingMonths, monthsTillRefi);
    const purchaseLoanPayM = setLoanValues(
      firstPurchaseLoan,
      purchaseLoanAmount,
      9,
      15,
      {
        hasMortgageIns: true,
        mortgageInsUpfront: purchaseMortIns,
      }
    );
    const refiLoanPayM = setLoanValues(firstRefiLoan, refiLoanAmount, 7, 30, {
      hasMortgageIns: true,
      mortgageInsUpfront: refiMortIns,
    });

    const numOrZero = (num: NumObjOutput) => {
      if (typeof num === "number") return num;
      else return 0;
    };

    const getHoldingCost = (dealMode: DealMode): number => {
      return numOrZero(
        holdingCostTotal(
          dealMode,
          holdingMonths,
          monthsTillRefi,
          propertyHoldingCost,
          purchaseLoanPayM,
          refiLoanPayM
        )
      );
    };

    const homeBuyer =
      purchasePrice +
      rehabCost +
      miscOnetimeCost +
      purchaseMortIns +
      purchaseClosing;
    const buyAndHold = homeBuyer + mgmtUpfront;
    const fixAndFlip = homeBuyer + getHoldingCost("fixAndFlip") + sellingCost;
    const brrrr =
      homeBuyer +
      mgmtUpfront +
      getHoldingCost("brrrr") +
      refiMortIns +
      refiClosing; // selling costs were expected to be subtracted, but they weren't

    setHoldingAndTillRefiMonths(holdingMonths, monthsTillRefi);
    property.updateValues({ purchasePrice: numObj(purchasePrice) });
    addHoldingTaxesHomeInsYearly(property, taxesYearly, homeInsYearly);

    setOnetimeEditor(property.onlyChild("repairValue"), rehabCost);
    setOnetimeEditor(property.onlyChild("miscOnetimeCost"), miscOnetimeCost);
    setOnetimeEditor(property.onlyChild("sellingCostValue"), sellingCost);

    setOnetimeEditor(
      firstPurchaseLoan.onlyChild("closingCostValue"),
      purchaseClosing
    );
    setOnetimeEditor(firstRefiLoan.onlyChild("closingCostValue"), refiClosing);
    setOnetimeEditor(mgmt.onlyChild("miscOnetimeCost"), mgmtUpfront);

    return {
      homeBuyer,
      buyAndHold,
      fixAndFlip,
      brrrr,
    };
  };
  it("should calculate refiLoanHolding spans", () => {
    let holdingMonths = 4;
    const monthsTillRefi = 6;
    setHoldingAndTillRefiMonths(holdingMonths, monthsTillRefi);

    perDealModeDeal((dealMode) => {
      if (isDealMode(dealMode, "hasRefi")) {
        testSpanVarb(
          "refiLoanHolding",
          refiHoldingSpan(dealMode, holdingMonths, monthsTillRefi)
        );
        holdingMonths = 7;
        property.onlyChild("holdingPeriod").updateValues({
          valueEditor: numObj(holdingMonths),
          valueEditorUnit: "months",
        });

        testSpanVarb(
          "refiLoanHolding",
          refiHoldingSpan(dealMode, holdingMonths, monthsTillRefi)
        );
      } else {
        testSpanVarb("refiLoanHolding", "N/A");
      }
    });
  });
  it("should calculate purchaseLoanHolding spans", () => {
    const holdingMonths = 7;
    const monthsTillRefi = 6;
    setHoldingAndTillRefiMonths(holdingMonths, monthsTillRefi);
    perDealModeDeal((dealMode) => {
      testSpanVarb(
        "purchaseLoanHolding",
        purchaseHoldingSpan(dealMode, holdingMonths, monthsTillRefi)
      );
    });
  });
  it("should calculate refiHoldingCost", () => {
    const holdingMonths = 7;
    const monthsTillRefi = 6;
    setHoldingAndTillRefiMonths(holdingMonths, monthsTillRefi);
    const refiLoanPayM = setLoanValues(firstRefiLoan, 100000, 7, 30);

    expect(refiFinancing.numValue("loanPaymentMonthly")).toBe(refiLoanPayM);
    perDealModeDeal((dealMode) => {
      const cost = refiLoanHoldingCost(
        dealMode,
        holdingMonths,
        monthsTillRefi,
        refiLoanPayM
      );
      if (typeof cost === "number") {
        expect(() => deal.numValue("refiLoanHoldingMonths")).not.toThrow();
      }

      testVarb("refiLoanHoldingCost", cost);
    });
  });
  it("should calculate purchaseHoldingCost", () => {
    const holdingMonths = 7;
    const monthsTillRefi = 6;

    setHoldingAndTillRefiMonths(holdingMonths, monthsTillRefi);
    const purchaseLoanPayM = setLoanValues(firstPurchaseLoan, 80000, 9, 15);

    perDealModeDeal((dealMode) => {
      const cost = purchaseLoanHoldingCost(
        dealMode,
        holdingMonths,
        monthsTillRefi,
        purchaseLoanPayM
      );
      if (isDealMode(dealMode, "hasHolding")) {
        expect(deal.numValue("purchaseLoanHoldingMonths") > 0);
      }
      testVarb("purchaseLoanHoldingCost", cost);
    });
  });
  it("should calculate holdingCostTotal", () => {
    const holdingMonths = 7;
    const monthsTillRefi = 6;
    const propertyHoldingMonthly = 500;
    const propertyHoldingCost = holdingMonths * propertyHoldingMonthly;
    const purchaseLoanPayM = setLoanValues(firstPurchaseLoan, 80000, 9, 15);
    const refiLoanPayM = setLoanValues(firstRefiLoan, 100000, 7, 30);

    setHoldingAndTillRefiMonths(holdingMonths, monthsTillRefi);
    setPeriodicEditor(
      property.onlyChild("miscHoldingCost"),
      propertyHoldingMonthly
    );

    perDealModeDeal((dealMode) => {
      const total = holdingCostTotal(
        dealMode,
        holdingMonths,
        monthsTillRefi,
        propertyHoldingCost,
        purchaseLoanPayM,
        refiLoanPayM
      );
      testVarb("holdingCostTotal", total);
    });
  });
  it("should calculate preFinanceOnetimeExpenses", () => {
    const perDealMode = setPreFinanceOnetimeExpenses();
    perDealModeDeal((dealMode) => {
      testVarb("preFinanceOneTimeExpenses", perDealMode[dealMode]);
    });
  });
  it("should calculate totalInvestment", () => {
    const purchaseLoanAmount = 80000;
    const refiLoanAmount = 120000;
    const perDealMode = setPreFinanceOnetimeExpenses(
      purchaseLoanAmount,
      refiLoanAmount
    );
    perDealModeDeal((dealMode) => {
      const preFinanceExpenses = perDealMode[dealMode];
      testVarb("totalInvestment", preFinanceExpenses - purchaseLoanAmount);
    });
  });
  // it("should calculate cashCostsPlusPurchaseLoanRepay", () => {});
  it("should calculate valueAddProfit", () => {
    const purchaseLoanAmount = 75000;
    const afterRepairValue = 150000;
    const refiLoanAmount = 140000;
    const expensesPerDealMode = setPreFinanceOnetimeExpenses(
      purchaseLoanAmount,
      refiLoanAmount
    );
    property.updateValues({ afterRepairValueEditor: numObj(afterRepairValue) });
    perDealModeDeal((dealMode) => {
      testVarb(
        "valueAddProfit",
        getProfit(dealMode, expensesPerDealMode[dealMode], afterRepairValue),
        dealMode
      );
    });
  });
  it("should calculate timeTillValueAddProfit", () => {
    const tillRefi = 6;
    refiFinancing.onlyChild("timeTillRefinance").updateValues({
      valueEditor: numObj(tillRefi),
      valueEditorUnit: "months",
    });

    perDealModeDeal((dealMode) => {
      let holdingPeriod = 4;
      property.onlyChild("holdingPeriod").updateValues({
        valueEditor: numObj(holdingPeriod),
        valueEditorUnit: "months",
      });

      if (dealMode === "fixAndFlip") {
        testSpanVarb("timeTillValueAddProfit", holdingPeriod);
      } else if (dealMode === "brrrr") {
        testSpanVarb("timeTillValueAddProfit", tillRefi);
        holdingPeriod = 7;
        property.onlyChild("holdingPeriod").updateValues({
          valueEditor: numObj(holdingPeriod),
        });

        testSpanVarb("timeTillValueAddProfit", holdingPeriod);
      } else {
        testSpanVarb("timeTillValueAddProfit", "N/A");
      }
    });
  });
  it("should calculate valueAddRoiPercent", () => {
    const purchaseLoanAmount = 75000;
    const arv = 150000;
    const refiLoanAmount = 140000;

    property.updateValues({ afterRepairValueEditor: numObj(arv) });

    // this line sets holdingMonths and timeTillRefinance to 12
    const perDealMode = setPreFinanceOnetimeExpenses(
      purchaseLoanAmount,
      refiLoanAmount
    );

    perDealModeDeal((dealMode) => {
      const preFinanceExpenses = perDealMode[dealMode];
      const totalInvestment = preFinanceExpenses - purchaseLoanAmount;
      const profit = getProfit(dealMode, perDealMode[dealMode], arv);

      if (isDealMode(dealMode, "hasHolding")) {
        const monthsTillValueAdd = deal.numValue(
          "timeTillValueAddProfitMonths"
        );
        const holdingMonths = property.numValue("holdingPeriodMonths");
        const decimal = roundS.decimal(
          validateNumber(profit) / totalInvestment
        );
        const percent = roundS.percent(mathS.decimalToPercent(decimal));
        const denominator =
          dealMode === "brrrr" ? monthsTillValueAdd : holdingMonths;
        const percentPerMonth = roundS.percent(percent / denominator);
        const percentAnnualized = roundS.percent(percentPerMonth * 12);
        testVarb("valueAddRoiDecimal", decimal);
        testVarb("valueAddRoiPercent", percent);
        testVarb("valueAddRoiPercentPerMonth", percentPerMonth);
        testVarb("valueAddRoiPercentAnnualized", percentAnnualized);
      } else {
        testVarb("valueAddRoiDecimal", "N/A");
        testVarb("valueAddRoiPercent", "N/A");
        testVarb("valueAddRoiPercentPerMonth", "N/A");
        testVarb("valueAddRoiPercentAnnualized", "N/A");
      }
    });
  });
  it("should calculate ongoingLoanPayment", () => {
    const purchasePayment = setLoanValues(firstPurchaseLoan, 50000, 10, 30);
    const refiPayment = setLoanValues(firstRefiLoan, 70000, 7, 30);
    const payments = ongoingLoanPayment(purchasePayment, refiPayment);
    perDealModeDeal((dealMode) => {
      testPeriodicVarb("ongoingLoanPayment", payments[dealMode]);
    });
  });
  it("should calculate ongoingPiti", () => {
    const taxes = 2400;
    const homeIns = 1800;
    const { taxesMonthly, homeInsMonthly } = addOngoingTaxesHomeInsYearly(
      property,
      taxes,
      homeIns
    );
    const propertyOngoing = taxesMonthly + homeInsMonthly;

    const purchaseMortInsM = 170;
    const refiMortInsM = purchaseMortInsM * 2;

    const purchasePayment = setLoanValues(firstPurchaseLoan, 50000, 10, 30, {
      hasMortgageIns: true,
      mortgageInsMonthly: purchaseMortInsM,
    });

    const refiPayment = setLoanValues(firstRefiLoan, 70000, 7, 30, {
      hasMortgageIns: true,
      mortgageInsMonthly: refiMortInsM,
    });

    const ongoingPayments = ongoingLoanPayment(purchasePayment, refiPayment);
    const ongoingPiti = dealModes.reduce((outputs, dealMode) => {
      if (isDealMode(dealMode, "hasOngoing")) {
        let num = ongoingPayments[dealMode] as number;
        num += propertyOngoing;
        if (dealMode === "brrrr") {
          num += refiMortInsM;
        } else {
          num += purchaseMortInsM;
        }
        outputs[dealMode] = num;
      } else {
        outputs[dealMode] = "N/A";
      }
      return outputs;
    }, {} as Record<DealMode, NumObjOutput>);
    perDealModeDeal((dealMode) => {
      testPeriodicVarb("ongoingPiti", ongoingPiti[dealMode]);
    });
  });
  it("Should calculate ongoingExpenses periodic", () => {
    const setPropertyEditor = (
      childName: StrictExtract<
        ChildName<"property">,
        | "taxesOngoing"
        | "homeInsOngoing"
        | "utilityOngoing"
        | "maintenanceOngoing"
        | "capExValueOngoing"
        | "miscOngoingCost"
      >,
      amount: number
    ) => {
      setPeriodicEditor(property.onlyChild(childName), amount);
    };

    const taxes = 300;
    const homeIns = 160;
    const utilities = 400;
    const maintenance = 200;
    const capEx = 250;
    const propertyMisc = 20;

    const purchaseMortIns = 100;
    const refiMortIns = 110;

    const vacancyLoss = 280;
    const mgmtBasePay = 270;
    const mgmtMisc = 50;

    const purchaseLoanPay = setLoanValues(firstPurchaseLoan, 80000, 7, 30, {
      hasMortgageIns: true,
      mortgageInsMonthly: 100,
    });
    const refiLoanPay = setLoanValues(firstRefiLoan, 100000, 7, 30, {
      hasMortgageIns: true,
      mortgageInsMonthly: 110,
    });
    setPropertyEditor("taxesOngoing", taxes);
    setPropertyEditor("homeInsOngoing", homeIns);
    setPropertyEditor("utilityOngoing", utilities);
    setPropertyEditor("maintenanceOngoing", maintenance);
    setPropertyEditor("capExValueOngoing", capEx);
    setPropertyEditor("miscOngoingCost", propertyMisc);
    setPeriodicEditor(mgmt.onlyChild("vacancyLossValue"), vacancyLoss);
    setPeriodicEditor(mgmt.onlyChild("mgmtBasePayValue"), mgmtBasePay);
    setPeriodicEditor(mgmt.onlyChild("miscOngoingCost"), mgmtMisc);

    const propertySum = roundS.cents(
      taxes + homeIns + utilities + maintenance + capEx + propertyMisc
    );

    const purchaseLoanSum = roundS.cents(purchaseMortIns + purchaseLoanPay);
    const refiLoanSum = roundS.cents(refiMortIns + refiLoanPay);
    const mgmtSum = roundS.cents(vacancyLoss + mgmtBasePay + mgmtMisc);

    const dealModeExpenses = {
      homeBuyer: roundS.cents(propertySum + purchaseLoanSum),
      buyAndHold: roundS.cents(propertySum + purchaseLoanSum + mgmtSum),
      brrrr: roundS.cents(propertySum + refiLoanSum + mgmtSum),
    } as const;

    const purchasePrincipal = purchaseFinancing.numValue(
      "averagePrincipalMonthly"
    );
    const refiPrincipal = refiFinancing.numValue("averagePrincipalMonthly");

    const averagePrincipal = {
      homeBuyer: purchasePrincipal,
      buyAndHold: purchasePrincipal,
      brrrr: refiPrincipal,
    } as const;

    property.updateValues({ purchasePrice: numObj(130000) });
    setPeriodicEditor(property.onlyChild("miscOngoingRevenue"), 3000);

    perDealModeDeal((dealMode) => {
      if (isDealMode(dealMode, "hasOngoing")) {
        const expenses = dealModeExpenses[dealMode];
        const nonPrincipal = roundS.cents(
          expenses - averagePrincipal[dealMode]
        );

        const revenue = roundS.cents(
          property.numValue("revenueOngoingMonthly")
        );
        const cashFlow = roundS.cents(revenue - expenses);

        const totalInvestment = deal.numValue("totalInvestment");
        const cocRoi = mathS.decimalToPercent(cashFlow / totalInvestment);

        testPeriodicVarb("expensesOngoing", expenses);
        testPeriodicVarb("averageNonPrincipalOngoing", nonPrincipal);
        if (dealMode !== "homeBuyer") {
          testPeriodicVarb("cashFlow", cashFlow);
          testPeriodicVarb("cocRoi", cocRoi);
        } else {
          testPeriodicVarb("cashFlow", "N/A");
          testPeriodicVarb("cocRoi", "N/A");
        }
      } else {
        testPeriodicVarb("expensesOngoing", "N/A");
        testPeriodicVarb("averageNonPrincipalOngoing", "N/A");
        testPeriodicVarb("cashFlow", "N/A");
        testPeriodicVarb("cocRoi", "N/A");
      }
    });
  });
});
