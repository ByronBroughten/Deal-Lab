import { SolverActiveDeal } from "./SolverActiveDeal";
import { SolverSection } from "./SolverSection";

describe("Refi financing calculations", () => {
  let deal: SolverActiveDeal;
  let property: SolverSection<"property">;
  let financing: SolverSection<"financing">;
  let firstLoan: SolverSection<"loan">;
  let firstBaseValue: SolverSection<"loanBaseValue">;
  beforeEach(() => {
    deal = SolverActiveDeal.init("brrrr");
    property = deal.property;
    financing = deal.refiFinancing;
    firstLoan = financing.onlyChild("loan");
    firstBaseValue = firstLoan.onlyChild("loanBaseValue");
    financing.updateValues({ financingMethod: "useLoan" });
  });
  it("has the right financingModes", () => {
    const test = () => {
      financing.value("financingMode") === "refinance";
      const loans = financing.children("loan");
      for (const loan of loans) {
        loan.value("financingMode") === "refinance";
        const base = loan.onlyChild("loanBaseValue");
        base.value("financingMode") === "refinance";
      }
    };
    test();

    financing.addChildAndSolve("loan");
    test();

    const purchaseLoan = deal.purchaseFinancing.onlyChild("loan");
    firstLoan.loadSelfAndSolve(purchaseLoan.packMaker.makeSectionPack());
    test();
  });
  // it("calculates baseValue correctly", () => {
  //   firstBaseValue.updateValues({
  //     "valueSourceName": "arvLoanValue"
  //   });

  // })
});
