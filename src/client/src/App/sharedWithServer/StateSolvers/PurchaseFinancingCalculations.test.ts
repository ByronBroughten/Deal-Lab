import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import {
  UnionValue,
  unionValueArr,
} from "./../SectionsMeta/values/StateValue/unionValues";
import { Arr } from "./../utils/Arr";
import { SolverActiveDeal } from "./SolverActiveDeal";
import { SolverSection } from "./SolverSection";
import { setOnetimeEditor, setOnetimeList } from "./testUtils";

const singleSourceNames = Arr.extractStrict(
  unionValueArr("loanBaseValueSource"),
  ["repairLoanValue", "purchaseLoanValue"] as const
);

type SingleSourceName = (typeof singleSourceNames)[number];

describe("Purchase financing calculations", () => {
  let deal: SolverActiveDeal;
  let property: SolverSection<"property">;
  let financing: SolverSection<"financing">;
  let firstLoan: SolverSection<"loan">;
  let firstBaseValue: SolverSection<"loanBaseValue">;
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
  it("should calculate loanBaseDollars based on the editor", () => {
    const amount = 180000;
    firstBaseValue.updateValues({
      valueSourceName: "customAmountEditor",
      valueDollarsEditor: numObj(amount),
    });
    expect(firstBaseValue.numValue("valueDollars")).toBe(amount);
    expect(firstLoan.numValue("loanBaseDollars")).toBe(amount);
    expect(financing.numValue("loanBaseDollars")).toBe(amount);
  });

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
    firstLoan.updateValues({
      mortgageInsPeriodicSwitch: "monthly",
      mortgageInsPeriodicEditor: numObj(30),
      hasMortgageIns: true,
    });
    expect(financing.numValue("mortgageInsMonthly")).toBe(30);
    expect(financing.numValue("mortgageInsYearly")).toBe(30 * 12);

    firstLoan.updateValues({ hasMortgageIns: false });
    expect(financing.numValue("mortgageInsMonthly")).toBe(0);
    expect(financing.numValue("mortgageInsYearly")).toBe(0);
  });
  it("should calculate closing costs", () => {
    const closingCosts = firstLoan.onlyChild("closingCostValue");
    closingCosts.updateValues({ valueSourceName: "fivePercentLoan" });
    firstBaseValue.updateValues({
      valueSourceName: "customAmountEditor",
      valueDollarsEditor: numObj(100000),
    });
    expect(financing.numValue("closingCosts")).toBe(5000);

    setOnetimeEditor(closingCosts, 500);
    expect(financing.numValue("closingCosts")).toBe(500);

    setOnetimeList(closingCosts, [600, 400, 200]);
    expect(financing.numValue("closingCosts")).toBe(1200);
  });
  it("should calculate loan payments", () => {
    setFirstLoan(financing, property);
    addInterestOnlyLoan(financing);
    const paymentAmount = 912.6 + 50;
    expect(financing.numValue("loanPaymentMonthly")).toBe(paymentAmount);
    expect(financing.numValue("loanPaymentYearly")).toBe(paymentAmount * 12);

    firstLoan.updateValues({
      hasMortgageIns: true,
      mortgageInsPeriodicSwitch: "monthly",
      mortgageInsPeriodicEditor: numObj(100),
    });

    const expensesAmount = paymentAmount + 100;
    expect(financing.numValue("loanExpensesMonthly")).toBe(expensesAmount);
    expect(financing.numValue("loanExpensesYearly")).toBeCloseTo(
      expensesAmount * 12
    );
  });
});

function setFirstLoan(
  financing: SolverSection<"financing">,
  property: SolverSection<"property">
): void {
  property.updateValues({ purchasePrice: numObj(200000) });
  financing.updateValues({ financingMethod: "useLoan" });

  const loan = financing.onlyChild("loan");
  loan.updateValues({
    interestRatePercentPeriodicSwitch: "yearly",
    interestRatePercentPeriodicEditor: numObj(5),
    loanTermSpanSwitch: "years",
    loanTermSpanEditor: numObj(30),
  });

  const baseValue = loan.onlyChild("loanBaseValue");
  baseValue.updateValues({ valueSourceName: "purchaseLoanValue" });
  const purchaseValue = baseValue.onlyChild("purchaseLoanValue");
  purchaseValue.updateValues({
    valueSourceName: "amountPercentEditor",
    amountPercentEditor: numObj(75),
  });

  const wrappedValue = loan.addAndGetChild("wrappedInLoanValue", {
    sectionValues: { valueSourceName: "listTotal" },
  });
  const wrapped = wrappedValue.onlyChild("onetimeList");
  const amounts = [6000, 14000];

  for (const amount of amounts) {
    wrapped.addChildAndSolve("singleTimeItem", {
      sectionValues: { valueEditor: numObj(amount) },
    });
  }
}

function addInterestOnlyLoan(financing: SolverSection<"financing">): void {
  const loan = financing.addAndGetChild("loan", {
    sectionValues: {
      interestRatePercentPeriodicSwitch: "yearly",
      interestRatePercentPeriodicEditor: numObj(6),
      isInterestOnly: true,
      hasMortgageIns: false,
    },
  });
  const baseValue = loan.onlyChild("loanBaseValue");
  baseValue.updateValues({
    valueSourceName: "customAmountEditor",
    valueDollarsEditor: numObj(10000),
  });
}
