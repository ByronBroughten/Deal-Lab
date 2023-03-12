import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import { SetterTesterSection } from "./TestUtils/SetterTesterSection";

describe("SetterCalculations", () => {
  it("should calculate loan payments accurately", () => {
    const dealTester = SetterTesterSection.initActiveDeal();
    addTestLoan(dealTester);
    addInterestOnlyLoan(dealTester);

    const financing = dealTester.get.onlyChild("financing");
    const expectedLoanPayment = 912.6 + 50;
    const loanPaymentMonthly =
      financing.varbNext("loanPaymentMonthly").numberValue;
    expect(loanPaymentMonthly).toBe(expectedLoanPayment);

    const loanPaymentYearly =
      financing.varbNext("loanPaymentYearly").numberValue;
    expect(loanPaymentYearly).toBeCloseTo(12 * expectedLoanPayment, 1);

    const loanExpensesMonthly = financing.varbNext(
      "loanExpensesMonthly"
    ).numberValue;
    expect(loanExpensesMonthly).toBe(expectedLoanPayment + 100);
  });
  it("should calculate upfront investment accurately", () => {
    const dealTester = SetterTesterSection.initActiveDeal();
    const property = dealTester.setter.onlyChild("property");
    property.varb("purchasePrice").updateValue(numObj(200000));

    const propertyCostListGroup = property.onlyChild("upfrontExpenseGroup");
    const propertyCostValue =
      propertyCostListGroup.addAndGetChild("singleTimeValue");
    propertyCostValue.updateValues({ valueSourceName: "listTotal" });

    const propertyCostList = propertyCostValue.onlyChild("singleTimeList");
    const propertyCosts = [8000, 2000];
    for (const amount of propertyCosts) {
      propertyCostList.addChild("singleTimeItem", {
        sectionValues: { valueEditor: numObj(amount) },
      });
    }

    addTestLoan(dealTester);

    const financing = dealTester.setter.onlyChild("financing");
    financing.varb("financingMode").updateValue("useLoan");
    const loan = financing.addAndGetChild("loan", {
      sectionValues: { loanAmountInputMode: "loanAmount" },
    });
    const baseValue = loan.onlyChild("loanBaseValue");
    baseValue.updateValues({
      valueSourceName: "percentOfAssetEditor",
      valuePercentEditor: numObj(0),
    });
    const wrappedValue = loan.addAndGetChild("wrappedInLoanValue");
    wrappedValue.updateValues({
      valueSourceName: "valueEditor",
      valueEditor: numObj(5000),
    });

    const mgmt = dealTester.setter.onlyChild("mgmt");
    const expenseGroup = mgmt.onlyChild("upfrontExpenseGroup");
    const expenseValue = expenseGroup.addAndGetChild("singleTimeValue", {
      sectionValues: { valueSourceName: "listTotal" },
    });
    const mgmtCostList = expenseValue.onlyChild("singleTimeList");
    const mgmtCosts = [4000, 6000];
    for (const amount of mgmtCosts) {
      mgmtCostList.addChild("singleTimeItem", {
        sectionValues: { valueEditor: numObj(amount) },
      });
    }

    const upfrontInvestment =
      dealTester.get.varb("totalInvestment").numberValue;
    expect(upfrontInvestment).toBe(45000);
    // 200000 + 8000 + 2000 + 4000 + 6000 - 150000 - 20000 - 4000 - 1000
  });
  it("should calculate annual cash flow accurately", () => {
    const dealTester = SetterTesterSection.initActiveDeal();
    const property = dealTester.setter.onlyChild("property");

    const rents = [1300, 1700];
    for (const amount of rents) {
      property.addChild("unit", {
        sectionValues: {
          targetRentOngoingSwitch: "monthly",
          targetRentOngoingEditor: numObj(amount),
        },
      });
    }

    property.varb("taxesOngoingSwitch").updateValue("yearly");
    property.varb("taxesOngoingEditor").updateValue(numObj(1200));

    property.varb("homeInsOngoingSwitch").updateValue("yearly");
    property.varb("homeInsOngoingEditor").updateValue(numObj(1200));

    const propertyCostListGroup = property.onlyChild("ongoingExpenseGroup");
    const ongoingValue = propertyCostListGroup.addAndGetChild("ongoingValue", {
      sectionValues: { valueSourceName: "listTotal" },
    });
    const propertyCostList = ongoingValue.onlyChild("ongoingList");
    const propertyCosts = [200, 100, 150];
    for (const amount of propertyCosts) {
      propertyCostList.addChild("ongoingItem", {
        sectionValues: {
          valueOngoingSwitch: "monthly",
          valueSourceName: "valueEditor",
          valueOngoingEditor: numObj(amount),
        },
      });
    }

    addTestLoan(dealTester);
    const financing = dealTester.setter.onlyChild("financing");
    financing.varb("financingMode").updateValue("useLoan");
    // 1012.6 expense

    const mgmt = dealTester.setter.onlyChild("mgmt");
    const basePayValue = mgmt.onlyChild("mgmtBasePayValue");
    basePayValue.updateValues({
      valuePercentEditor: numObj(5),
      valueSourceName: "percentOfRentEditor",
    });

    const vacancyLossValue = mgmt.onlyChild("vacancyLossValue");
    vacancyLossValue.updateValues({ valueSourceName: "fivePercentRent" });

    const expenseGroup = mgmt.onlyChild("ongoingExpenseGroup");
    const mgmtCostListGroup = expenseGroup.addAndGetChild("ongoingValue", {
      sectionValues: { valueSourceName: "listTotal" },
    });
    const mgmtCostList = mgmtCostListGroup.onlyChild("ongoingList");
    const mgmtCosts = [100, 100];
    for (const amount of mgmtCosts) {
      mgmtCostList.addChild("ongoingItem", {
        sectionValues: {
          valueOngoingSwitch: "monthly",
          valueSourceName: "valueEditor",
          valueOngoingEditor: numObj(amount),
        },
      });
    }

    const cashFlowMonthly = dealTester.get.varb("cashFlowMonthly").numberValue;
    const cashFlowYearly = dealTester.get.varb("cashFlowYearly").numberValue;

    // + 1700
    // + 1300
    // - 100 taxes
    // - 100 home insurance
    // - 200 property cost
    // - 100 property cost
    // - 150 property cost
    // - 1012.6 loan payment
    // - 150 mgmt rent cut
    // - 150 mgmt vacancy loss
    // - 100 mgmt cost
    // - 100 mgmt cost

    expect(cashFlowMonthly).toBe(837.4);
    expect(cashFlowYearly).toBeCloseTo(cashFlowMonthly * 12, 1);
  });
});

function addTestLoan(dealTester: SetterTesterSection<"deal">): void {
  const property = dealTester.setter.onlyChild("property");
  property.varb("purchasePrice").updateValue(numObj(200000));

  const financing = dealTester.setter.onlyChild("financing");
  financing.varb("financingMode").updateValue("useLoan");

  const loan = financing.addAndGetChild("loan", {
    sectionValues: {
      loanAmountInputMode: "loanAmount",
      interestRatePercentOngoingSwitch: "yearly",
      interestRatePercentOngoingEditor: numObj(5),
      loanTermSpanSwitch: "years",
      loanTermSpanEditor: numObj(30),
    },
  });

  const baseValue = loan.onlyChild("loanBaseValue");
  baseValue.updateValues({
    valueSourceName: "percentOfAssetEditor",
    valuePercentEditor: numObj(75),
  });

  loan.varb("hasMortgageIns").updateValue(true);
  loan.varb("mortgageInsOngoingEditor").updateValue(numObj(1200));

  const wrappedValue = loan.addAndGetChild("wrappedInLoanValue", {
    sectionValues: { valueSourceName: "listTotal" },
  });
  const wrapped = wrappedValue.onlyChild("singleTimeList");
  const amounts = [6000, 14000];
  for (const amount of amounts) {
    wrapped.addChild("singleTimeItem", {
      sectionValues: { valueEditor: numObj(amount) },
    });
  }
}

function addInterestOnlyLoan(dealTester: SetterTesterSection<"deal">): void {
  const financing = dealTester.setter.onlyChild("financing");
  financing.varb("financingMode").updateValue("useLoan");

  const loan = financing.addAndGetChild("loan", {
    sectionValues: {
      interestRatePercentOngoingSwitch: "yearly",
      interestRatePercentOngoingEditor: numObj(6),
      isInterestOnly: true,
    },
  });
  const baseValue = loan.onlyChild("loanBaseValue");
  baseValue.updateValues({
    valueSourceName: "dollarsEditor",
    valueDollarsEditor: numObj(10000),
  });
}
