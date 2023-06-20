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
});
