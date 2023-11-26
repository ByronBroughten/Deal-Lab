import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import { roundToCents } from "../utils/math";
import {
  UnionValue,
  unionValueArr,
} from "./../SectionsMeta/values/StateValue/unionValues";
import { Arr } from "./../utils/Arr";
import { SolverActiveDeal } from "./SolverActiveDeal";
import { SolverSection } from "./SolverSection";
import {
  setFirstLoanFor912p6Monthly,
  setOnetimeEditor,
  setOnetimeList,
  setPeriodicEditor,
} from "./testUtils";

describe("Purchase financing calculations", () => {
  let deal: SolverActiveDeal;
  let property: SolverSection<"property">;
  let financing: SolverSection<"financing">;
  let firstLoan: SolverSection<"loan">;
  let firstBaseValue: SolverSection<"loanBaseValue">;

  const singleSourceNames = Arr.extractStrict(
    unionValueArr("loanBaseValueSource"),
    ["repairLoanValue", "purchaseLoanValue"] as const
  );
  type SingleSourceName = (typeof singleSourceNames)[number];

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
    deal = SolverActiveDeal.init("buyAndHold");
    property = deal.property;
    financing = deal.purchaseFinancing;
    firstLoan = financing.onlyChild("loan");
    firstBaseValue = firstLoan.onlyChild("loanBaseValue");
    financing.updateValues({ financingMethod: "useLoan" });
  });
  it("should calculate cash only loanBaseDollars", () => {
    property.updateValues({ purchasePrice: numObj(200000) });

    const zeroMethodNames = ["cashOnly", ""] as const;
    for (const methodName of zeroMethodNames) {
      financing.updateValues({ financingMethod: methodName });
      expect(financing.numValue("loanExpensesMonthly")).toBe(0);
      expect(financing.numValue("loanExpensesYearly")).toBe(0);
      expect(financing.numValue("loanBaseDollars")).toBe(0);
      expect(financing.numValue("loanTotalDollars")).toBe(0);
      expect(financing.numValue("closingCosts")).toBe(0);
    }
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

  it("should calculate loanBaseExtra correctly", () => {
    const test = (num: number) =>
      expect(firstBaseValue.numValue("valueDollars")).toBe(num);

    const loanAmount = 10000;
    firstBaseValue.updateValues({ valueSourceName: "purchaseLoanValue" });
    const purchaseValue = firstBaseValue.onlyChild("purchaseLoanValue");
    purchaseValue.updateValues({
      valueSourceName: "amountDollarsEditor",
      amountDollarsEditor: numObj(loanAmount),
    });

    let extraAmount = 12;
    const loanBaseExtra = firstBaseValue.onlyChild("loanBaseExtra");
    loanBaseExtra.updateValues({
      hasLoanExtra: true,
      valueSourceName: "valueDollarsEditor",
      valueDollarsEditor: numObj(extraAmount),
    });
    test(loanAmount + extraAmount);

    loanBaseExtra.updateValues({ valueSourceName: "listTotal" });
    extraAmount = setOnetimeList(loanBaseExtra, [12, 100, 1200]);
    test(loanAmount + extraAmount);

    loanBaseExtra.updateValues({
      hasLoanExtra: false,
    });
    test(loanAmount);
  });
  it("should calculate loanBaseDollars based on other single values", () => {
    const coefs: Record<SingleSourceName, number> = {
      repairLoanValue: 1,
      purchaseLoanValue: 2,
    };

    const assetAmounts: Record<SingleSourceName, number> = {
      repairLoanValue: 100000,
      purchaseLoanValue: 200000,
    };

    const amount = 100000;
    const rehabCoef = coefs.repairLoanValue;
    const purchasePriceCoef = coefs.purchaseLoanValue;

    prepRepairAndProperty(amount * rehabCoef, amount * purchasePriceCoef);

    const test = (num: number) => {
      expect(firstLoan.numValue("loanBaseDollars")).toBe(num);
    };

    const makeTest = (
      loanSourceName: SingleSourceName,
      valueSourceName: UnionValue<"percentDollarsSource">
    ) => {
      const assetAmount = assetAmounts[loanSourceName];

      firstBaseValue.updateValues({ valueSourceName: loanSourceName });
      const valueSection = firstBaseValue.onlyChild(loanSourceName);
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
      return testFns[valueSourceName];
    };

    for (const loanSourceName of singleSourceNames) {
      for (const valueSourceName of unionValueArr("percentDollarsSource")) {
        makeTest(loanSourceName, valueSourceName)();
      }
    }
  });
  it("should calculate loanBaseDollars based on purchasePrice and rehabCost", () => {
    firstBaseValue.updateValues({ valueSourceName: "priceAndRepairValues" });
    const purchaseLoanValue = firstBaseValue.onlyChild("purchaseLoanValue");
    const repairLoanValue = firstBaseValue.onlyChild("repairLoanValue");

    prepRepairAndProperty(10000, 100000);
    const test = (num: number) => {
      expect(firstLoan.numValue("loanBaseDollars")).toBe(num);
      expect(financing.numValue("loanBaseDollars")).toBe(num);
    };

    const testFns: Record<UnionValue<"percentDollarsSource">, () => void> = {
      amountDollarsEditor: () => {
        purchaseLoanValue.updateValues({
          valueSourceName: "amountDollarsEditor",
          amountDollarsEditor: numObj(85000),
        });
        repairLoanValue.updateValues({
          valueSourceName: "amountDollarsEditor",
          amountDollarsEditor: numObj(5000),
        });
        test(90000);
      },
      amountPercentEditor: () => {
        purchaseLoanValue.updateValues({
          valueSourceName: "amountPercentEditor",
          amountPercentEditor: numObj(80),
        });
        repairLoanValue.updateValues({
          valueSourceName: "amountPercentEditor",
          amountPercentEditor: numObj(100),
        });
        test(80000 + 10000);
      },
      offDollarsEditor: () => {
        purchaseLoanValue.updateValues({
          valueSourceName: "offDollarsEditor",
          offDollarsEditor: numObj(30000),
        });
        repairLoanValue.updateValues({
          valueSourceName: "offDollarsEditor",
          offDollarsEditor: numObj(2000),
        });
        test(70000 + 8000);
      },
      offPercentEditor: () => {
        purchaseLoanValue.updateValues({
          valueSourceName: "offPercentEditor",
          offPercentEditor: numObj(15),
        });
        repairLoanValue.updateValues({
          valueSourceName: "offPercentEditor",
          offPercentEditor: numObj(25),
        });
        test(85000 + 7500);
      },
    };

    for (const valueSourceName of unionValueArr("percentDollarsSource")) {
      testFns[valueSourceName]();
    }
  });
  it("should calculate mortgage insurance", () => {
    firstLoan.updateValues({ hasMortgageIns: true });
    const monthlyValue = 30;

    const mortIns = firstLoan.onlyChild("mortgageInsPeriodicValue");
    mortIns.onlyChild("dollarsEditor").updateValues({
      valueEditor: numObj(monthlyValue),
      valueEditorFrequency: "monthly",
    });

    expect(financing.numValue("mortgageInsMonthly")).toBe(monthlyValue);
    expect(financing.numValue("mortgageInsYearly")).toBe(monthlyValue * 12);

    firstLoan.updateValues({ hasMortgageIns: false });
    expect(financing.numValue("mortgageInsMonthly")).toBe(0);
    expect(financing.numValue("mortgageInsYearly")).toBe(0);
  });
  it("should calculate closing costs", () => {
    const closingCosts = firstLoan.onlyChild("closingCostValue");
    closingCosts.updateValues({ valueSourceName: "fivePercentLoan" });

    firstBaseValue.updateValues({ valueSourceName: "customAmountEditor" });
    const customLoanBase = firstBaseValue.onlyChild("customLoanBase");
    customLoanBase.updateValues({
      valueSourceName: "valueDollarsEditor",
      valueDollarsEditor: numObj(100000),
    });

    expect(customLoanBase.numValue("valueDollars")).toBe(100000);
    expect(firstLoan.numValue("loanBaseDollars")).toBe(100000);
    expect(firstLoan.numValue("fivePercentBaseLoan")).toBe(5000);
    expect(firstLoan.numValue("closingCosts")).toBe(5000);
    expect(financing.numValue("closingCosts")).toBe(5000);

    setOnetimeEditor(closingCosts, 500);
    expect(financing.numValue("closingCosts")).toBe(500);

    setOnetimeList(closingCosts, [600, 400, 200]);
    expect(financing.numValue("closingCosts")).toBe(1200);
  });
  it("should calculate loan payments", () => {
    setFirstLoanFor912p6Monthly(financing, property);
    addInterestOnlyLoan(financing);
    const paymentAmount = 912.6 + 50;
    expect(financing.numValue("loanPaymentMonthly")).toBe(paymentAmount);
    expect(financing.numValue("loanPaymentYearly")).toBe(paymentAmount * 12);

    setPeriodicEditor(
      firstLoan.onlyChild("mortgageInsPeriodicValue"),
      100,
      "monthly"
    );
    firstLoan.updateValues({ hasMortgageIns: true });

    const expensesAmount = paymentAmount + 100;
    expect(financing.numValue("loanExpensesMonthly")).toBe(expensesAmount);
    expect(financing.numValue("loanExpensesYearly")).toBeCloseTo(
      expensesAmount * 12
    );
  });
  it("should calculate averagePrincipal and averageInterest", () => {
    const test = (numYearly: number) => {
      const numMonthly = roundToCents(numYearly / 12);
      const prinYearly = firstLoan.numValue("averagePrincipalYearly");
      const prinMonthly = firstLoan.numValue("averagePrincipalMonthly");
      expect(prinYearly).toBe(numYearly);
      expect(prinMonthly).toBe(numMonthly);

      const payYearly = firstLoan.numValue("loanPaymentYearly");
      const payMonthly = firstLoan.numValue("loanPaymentMonthly");
      expect(firstLoan.numValue("averageInterestYearly")).toBe(
        payYearly - prinYearly
      );
      expect(firstLoan.numValue("averageInterestMonthly")).toBe(
        payMonthly - prinMonthly
      );
    };

    const custom = firstBaseValue.onlyChild("customLoanBase");
    custom.updateValues({
      valueSourceName: "valueDollarsEditor",
      valueDollarsEditor: numObj(100000),
    });

    firstBaseValue.updateValues({ valueSourceName: "customAmountEditor" });

    firstLoan.onlyChild("loanTermEditor").updateValues({
      valueEditor: numObj(30),
      valueEditorUnit: "years",
    });
    firstLoan.onlyChild("interestRateEditor").updateValues({
      valueEditor: numObj(7),
      valueEditorFrequency: "yearly",
    });

    test(roundToCents(100000 / 30));
  });
});

function addInterestOnlyLoan(financing: SolverSection<"financing">): void {
  const loan = financing.addAndGetChild("loan", {
    sectionValues: {
      isInterestOnly: true,
      hasMortgageIns: false,
    },
  });
  loan.onlyChild("loanTermEditor").updateValues({
    valueEditorUnit: "years",
  });
  loan.onlyChild("interestRateEditor").updateValues({
    valueEditor: numObj(6),
    valueEditorFrequency: "yearly",
  });

  const baseValue = loan.onlyChild("loanBaseValue");
  baseValue.updateValues({ valueSourceName: "customAmountEditor" });
  const custom = baseValue.onlyChild("customLoanBase");
  custom.updateValues({
    valueSourceName: "valueDollarsEditor",
    valueDollarsEditor: numObj(10000),
  });
}
