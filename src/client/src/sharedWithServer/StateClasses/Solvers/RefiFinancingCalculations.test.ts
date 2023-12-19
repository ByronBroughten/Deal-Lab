import { numObj } from "../../sectionVarbsConfig/StateValue/NumObj";
import {
  UnionValue,
  unionValueArr,
} from "../../sectionVarbsConfig/StateValue/unionValues";
import { Arr } from "../../utils/Arr";
import { SolverActiveDeal } from "./SolverActiveDeal";
import { SolverSection } from "./SolverSection";
import { setOnetimeList } from "./testUtils";

describe("Refi financing calculations", () => {
  let deal: SolverActiveDeal;
  let property: SolverSection<"property">;
  let financing: SolverSection<"financing">;
  let firstLoan: SolverSection<"loan">;
  let firstBaseValue: SolverSection<"loanBaseValue">;

  const emptySourceNames = Arr.extractStrict(
    unionValueArr("loanBaseValueSource"),
    ["repairLoanValue", "purchaseLoanValue"] as const
  );

  const prepRepairAndProperty = (
    repairAmount: number,
    propertyAmount: number
  ) => {
    const repairValue = property.onlyChild("repairValue");
    repairValue.updateValues({
      valueSourceName: "valueDollarsEditor",
      valueDollarsEditor: numObj(repairAmount),
    });
    property.updateValues({ purchasePrice: numObj(propertyAmount) });
  };

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
        const base = loan.onlyChild("loanBaseValue");
        expect(loan.value("financingMode")).toBe("refinance");
        expect(base.value("financingMode")).toBe("refinance");
      }
    };
    test();

    financing.addChildAndSolve("loan");
    test();

    const purchaseLoan = deal.purchaseFinancing.onlyChild("loan");
    firstLoan.loadSelfAndSolve(purchaseLoan.packMaker.makeSectionPack());
    test();
  });
  it("should calculate loanBaseDollars based on a custom amount", () => {
    const amount = 180000;
    firstBaseValue.updateValues({ valueSourceName: "customAmountEditor" });
    const custom = firstBaseValue.onlyChild("customLoanBase");
    custom.updateValues({
      valueSourceName: "valueDollarsEditor",
      valueDollarsEditor: numObj(amount),
    });
    expect(firstBaseValue.numValue("valueDollars")).toBe(amount);
    expect(firstLoan.numValue("loanBaseDollars")).toBe(amount);
    expect(financing.numValue("loanBaseDollars")).toBe(amount);

    custom.updateValues({ valueSourceName: "listTotal" });
    const nextAmount = setOnetimeList(custom, [100000, 20000]);
    expect(firstBaseValue.numValue("valueDollars")).toBe(nextAmount);
    expect(firstLoan.numValue("loanBaseDollars")).toBe(nextAmount);
    expect(financing.numValue("loanBaseDollars")).toBe(nextAmount);
  });
  it("should calculate loanBaseDollars based on arv", () => {
    const extraAmount = 1000;
    const extra = firstBaseValue.onlyChild("loanBaseExtra");
    extra.updateValues({
      hasLoanExtra: true,
      valueSourceName: "valueDollarsEditor",
      valueDollarsEditor: numObj(extraAmount),
    });

    const test = (num: number) => {
      expect(firstBaseValue.numValue("valueDollars")).toBe(num + extraAmount);
    };
    const assetAmount = 100000;
    property.updateValues({ afterRepairValueEditor: numObj(100000) });

    firstBaseValue.updateValues({ valueSourceName: "arvLoanValue" });
    const valueSection = firstBaseValue.onlyChild("arvLoanValue");
    const testFns: Record<UnionValue<"percentDollarsSource">, () => void> = {
      amountDollarsEditor: () => {
        const inputAmount = 75000;
        valueSection.updateValues({
          valueSourceName: "amountDollarsEditor",
          amountDollarsEditor: numObj(inputAmount),
        });
        test(inputAmount);
      },
      amountPercentEditor: () => {
        valueSection.updateValues({
          valueSourceName: "amountPercentEditor",
          amountPercentEditor: numObj(80),
        });
        test(assetAmount * 0.8);
      },
      offDollarsEditor: () => {
        const inputAmount = 30000;
        valueSection.updateValues({
          valueSourceName: "offDollarsEditor",
          offDollarsEditor: numObj(inputAmount),
        });
        test(assetAmount - inputAmount);
      },
      offPercentEditor: () => {
        valueSection.updateValues({
          valueSourceName: "offPercentEditor",
          offPercentEditor: numObj(15),
        });
        test(assetAmount * 0.85);
      },
    };

    for (const valueSourceName of unionValueArr("percentDollarsSource")) {
      testFns[valueSourceName]();
    }
  });
  it("Should show empty for other purchase and repair value sources", () => {
    prepRepairAndProperty(100000, 200000);

    const test = () => {
      // expect(firstBaseValue.value("valueDollars").mainText).toBe("");
      // expect(firstBaseValue.value("valueDollars").solvableText).toBe("");
      expect(firstBaseValue.varb("valueDollars").get.numberOrQuestionMark).toBe(
        "?"
      );
    };

    for (const sourceName of emptySourceNames) {
      firstBaseValue.updateValues({
        valueSourceName: sourceName,
      });
      const child = firstBaseValue.onlyChild(sourceName);
      child.updateValues({
        valueSourceName: "amountDollarsEditor",
        amountDollarsEditor: numObj(10000),
      });
      test();
    }
    firstBaseValue.updateValues({ valueSourceName: "priceAndRepairValues" });
    test();
  });
});
