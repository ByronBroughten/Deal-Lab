import { switchKeyToVarbNames } from "../SectionsMeta/allBaseSectionVarbs/baseSwitchNames";
import { VarbName } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import {
  DealMode,
  dealModes,
} from "../SectionsMeta/values/StateValue/dealMode";
import { numObj, NumObjOutput } from "../SectionsMeta/values/StateValue/NumObj";
import { roundS } from "../SectionsMeta/values/StateValue/valuesShared/calculations/numUnitParams";
import { SolverActiveDeal } from "./SolverActiveDeal";
import { SolverSection } from "./SolverSection";
import { addHoldingTaxesHomeInsYearly, setOnetimeEditor } from "./testUtils";

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
    firstPurchaseLoan = purchaseFinancing.onlyChild("loan");
    refiFinancing = activeDeal.refiFinancing;
    firstRefiLoan = refiFinancing.onlyChild("loan");
    mgmt = activeDeal.mgmt;
  });

  const testVarb = (varbName: VarbName<"deal">, num: number) => {
    expect(deal.numValue(varbName)).toBe(num);
  };

  const testVarbPerDealMode = (
    varbName: VarbName<"deal">,
    nums: Record<DealMode, NumObjOutput>
  ) => {
    for (const dealMode of dealModes) {
      expect(deal.numOutput(varbName)).toBe(nums[dealMode]);
    }
  };

  type BaseName =
    | "expenses"
    | "averageNonPrincipalCost"
    | "cashFlow"
    | "cocRoi"
    | "ongoingLoanPayment"
    | "ongoingPiti";

  const testPeriodicVarb = (baseName: BaseName, num: number) => {
    const varbNames = switchKeyToVarbNames(baseName, "periodic");
    expect(deal.numValue(varbNames.monthly)).toBe(num);
    expect(deal.numValue(varbNames.yearly)).toBe(num * 12);
  };

  const testSpanVarb = (
    baseName: "purchaseLoanHolding" | "refiLoanHolding",
    num: number
  ) => {
    const varbNames = switchKeyToVarbNames(baseName, "monthsYears");
    expect(deal.numValue(varbNames.months)).toBe(num);
    expect(deal.numValue(varbNames.years)).toBe(roundS.decimal(num / 12));
  };

  const setLoanBaseValue = (loan: SolverSection<"loan">, num: number) => {
    const baseValue = loan.onlyChild("loanBaseValue");
    baseValue.updateValues({ valueSourceName: "customAmountEditor" });
    const custom = baseValue.onlyChild("customLoanBase");
    custom.updateValues({
      valueSourceName: "valueDollarsEditor",
      valueDollarsEditor: numObj(num),
    });
  };

  const setPreFinanceOnetimeExpenses = () => {
    property.updateValues({
      purchasePrice: numObj(100000),
      holdingPeriodSpanEditor: numObj(12),
      holdingPeriodSpanSwitch: "months",
    });
    setOnetimeEditor(property.onlyChild("repairValue"), 500);
    setOnetimeEditor(property.onlyChild("miscOnetimeCost"), 1000);
    setOnetimeEditor(property.onlyChild("sellingCostValue"), 5000);

    // for holding total
    addHoldingTaxesHomeInsYearly(property, 2400, 1200);

    setOnetimeEditor(firstPurchaseLoan.onlyChild("closingCostValue"), 6000);
    setOnetimeEditor(mgmt.onlyChild("miscOnetimeCost"), 700);
  };
  it("should calculate refiLoanHolding spans", () => {
    property.updateValues({
      holdingPeriodSpanEditor: numObj(4),
      holdingPeriodSpanSwitch: "months",
    });

    refiFinancing.updateValues({
      timeTillRefinanceSpanEditor: numObj(6),
      timeTillRefinanceSpanSwitch: "months",
    });

    testSpanVarb("refiLoanHolding", 0);
    property.updateValues({ holdingPeriodSpanEditor: numObj(7) });
    testSpanVarb("refiLoanHolding", 1);
  });
  it("should calculate purchaseLoanHolding spans", () => {
    property.updateValues({
      holdingPeriodSpanEditor: numObj(7),
      holdingPeriodSpanSwitch: "months",
    });

    refiFinancing.updateValues({
      timeTillRefinanceSpanEditor: numObj(6),
      timeTillRefinanceSpanSwitch: "months",
    });
    testSpanVarb("purchaseLoanHolding", 6);
  });
  it("should calculate purchaseLoanHoldingCost", () => {});
  it("should calculate refiLoanHoldingCost", () => {});
  it("should calculate loanHoldingCostTotal", () => {});
  it("should calculate preFinanceOnetimeExpenses", () => {
    property.updateValues({
      purchasePrice: numObj(100000),
      holdingPeriodSpanEditor: numObj(12),
      holdingPeriodSpanSwitch: "months",
    });
    setOnetimeEditor(property.onlyChild("repairValue"), 500);

    // for holding total
    addHoldingTaxesHomeInsYearly(property, 2400, 1200);
  });
  it("should calculate totalInvestment", () => {
    setLoanBaseValue(firstPurchaseLoan, 80000);
  });

  // should I test all of them for each dealMode?

  // preFinanceOnetimeExpenses
  // totalInvestment

  // purchaseAndRefiClosingCosts
  // averageNonPrincipalCost periodic

  // cashFlow periodic

  // cocRoi periodic
  // cashExpensesPlusLoanRepay
  // expenses

  // ongoingLoanPayment
  // onogingPiti

  // roiPercent
  // roiPercentPerMonth
  // roiPercentAnnualized

  // totalProfit
});
