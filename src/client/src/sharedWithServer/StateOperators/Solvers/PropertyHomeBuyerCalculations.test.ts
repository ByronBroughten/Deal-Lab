import { numObj } from "../../stateSchemas/StateValue/NumObj";
import { SolverActiveDeal } from "./SolverActiveDeal";
import { SolverSection } from "./SolverSection";
import {
  setFirstLoanFor912p6Monthly,
  setOnetimeEditor,
  setPeriodicEditor,
  setPeriodicList,
} from "./testUtils";

// homeBuyer: ["totalInvestment", "ongoingPitiMonthly", "dealExpensesOngoingYearly"],
describe("homeBuyer output calculations", () => {
  let activeDeal: SolverActiveDeal;
  let deal: SolverSection<"deal">;
  let property: SolverSection<"property">;
  let financing: SolverSection<"financing">;
  let firstLoan: SolverSection<"loan">;

  beforeEach(() => {
    activeDeal = SolverActiveDeal.init("homeBuyer");
    deal = activeDeal.solver;
    property = activeDeal.property;
    financing = activeDeal.purchaseFinancing;
    firstLoan = financing.onlyChild("loan");

    financing.updateValues({ financingMethod: "useLoan" });
  });

  it("should calculate totalInvestment", () => {
    property.updateValues({ purchasePrice: numObj(200000) });
    setOnetimeEditor(property.onlyChild("repairValue"), 20000);
    setOnetimeEditor(firstLoan.onlyChild("closingCostValue"), 6000);
    setOnetimeEditor(property.onlyChild("miscOnetimeCost"), 3000);
    setOnetimeEditor(property.onlyChild("costOverrunValue"), 2000);
    const baseValue = firstLoan.onlyChild("loanBaseValue");

    baseValue.updateValues({ valueSourceName: "customAmountEditor" });
    const custom = baseValue.onlyChild("customLoanBase");
    custom.updateValues({
      valueSourceName: "valueDollarsEditor",
      valueDollarsEditor: numObj(180000),
    });

    const expenseAmount = 200000 + 20000 + 6000 + 3000 + 2000;
    expect(deal.numValue("preFinanceOneTimeExpenses")).toBe(expenseAmount);
    expect(deal.numValue("totalInvestment")).toBe(expenseAmount - 180000);
  });
  it("should calculate ongoingPiti", () => {
    setPeriodicEditor(property.onlyChild("taxesOngoing"), 300, "monthly");
    setPeriodicEditor(property.onlyChild("homeInsOngoing"), 200, "monthly");

    setPeriodicEditor(
      firstLoan.onlyChild("mortgageInsPeriodicValue"),
      100,
      "monthly"
    );

    firstLoan.updateValues({
      hasMortgageIns: true,
    });
    setFirstLoanFor912p6Monthly(financing, property);

    const amount = 300 + 200 + 100 + 912.6;
    expect(deal.numValue("ongoingPitiMonthly")).toBe(amount);
    expect(deal.numValue("ongoingPitiYearly")).toBeCloseTo(amount * 12);
  });
  it("should calculate ongoing expenses", () => {
    setPeriodicEditor(property.onlyChild("taxesOngoing"), 300, "monthly");
    setPeriodicEditor(property.onlyChild("homeInsOngoing"), 200, "monthly");
    setPeriodicEditor(property.onlyChild("miscOngoingCost"), 100, "monthly");
    setPeriodicList(property.onlyChild("utilityOngoing"), [50], "monthly");
    setPeriodicEditor(property.onlyChild("maintenanceOngoing"), 30, "monthly");
    setPeriodicEditor(property.onlyChild("capExValueOngoing"), 80, "monthly");

    setPeriodicEditor(
      firstLoan.onlyChild("mortgageInsPeriodicValue"),
      120,
      "monthly"
    );

    setFirstLoanFor912p6Monthly(financing, property);
    firstLoan.updateValues({ hasMortgageIns: true });

    const amount = 300 + 200 + 100 + 50 + 30 + 80 + 912.6 + 120;
    expect(deal.numValue("expensesOngoingMonthly")).toBe(amount);
    expect(deal.numValue("expensesOngoingYearly")).toBeCloseTo(amount * 12);
  });
});
