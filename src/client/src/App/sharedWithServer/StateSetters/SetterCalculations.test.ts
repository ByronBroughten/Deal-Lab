import { PiCalculationName } from "../SectionsMeta/baseSectionsVarbs/baseValues/calculations/piCalculations";
import { numObj } from "../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { SetterTesterSection } from "./TestUtils/SetterTesterSection";

describe("SetterCalculations", () => {
  it("should calculate loan payments accurately", () => {
    const dealTester = SetterTesterSection.init("deal");
    addTestLoan(dealTester);
    addInterestOnlyLoan(dealTester);
    const financing = dealTester.setter.onlyChild("financing");

    const expectedLoanPayment = 912.6 + 50;
    const loanPaymentMonthly =
      financing.get.varb("loanPaymentMonthly").numberValue;
    const loanPaymentYearly =
      financing.get.varb("loanPaymentYearly").numberValue;
    const loanExpensesMonthly =
      financing.varb("expensesMonthly").get.numberValue;
    expect(loanPaymentMonthly).toBe(expectedLoanPayment);
    expect(loanExpensesMonthly).toBe(expectedLoanPayment + 100);
    expect(loanPaymentYearly).toBeCloseTo(12 * expectedLoanPayment, 1);
  });
  it("should calculate upfront investment accurately", () => {
    const dealTester = SetterTesterSection.init("deal");
    const propertyGeneral = dealTester.setter.onlyChild("propertyGeneral");
    const property = propertyGeneral.onlyChild("property");
    property.varb("price").updateValue(numObj(200000));

    const propertyCostListGroup = property.onlyChild("upfrontExpenseGroup");
    const propertyCostValue = propertyCostListGroup.addAndGetChild(
      "singleTimeValue",
      { dbVarbs: { isItemized: true } }
    );
    const propertyCostList = propertyCostValue.onlyChild("singleTimeList");
    const propertyCosts = [8000, 2000];
    for (const amount of propertyCosts) {
      propertyCostList.addChild("singleTimeItem", {
        dbVarbs: { valueEditor: numObj(amount) },
      });
    }

    addTestLoan(dealTester);

    const financing = dealTester.setter.onlyChild("financing");
    const loan = financing.addAndGetChild("loan");
    loan.varb("loanBasePercentEditor").updateValue(numObj(0));

    const wrappedValue = loan.addAndGetChild("wrappedInLoanValue");
    wrappedValue.updateValues({ valueEditor: numObj(5000) });

    const mgmtGeneral = dealTester.setter.onlyChild("mgmtGeneral");
    const mgmt = mgmtGeneral.addAndGetChild("mgmt");
    const expenseValue = mgmt.addAndGetChild("upfrontExpenseValue", {
      dbVarbs: { isItemized: true },
    });
    const mgmtCostList = expenseValue.onlyChild("singleTimeList");
    const mgmtCosts = [4000, 6000];
    for (const amount of mgmtCosts) {
      mgmtCostList.addChild("singleTimeItem", {
        dbVarbs: { valueEditor: numObj(amount) },
      });
    }

    const upfrontInvestment =
      dealTester.get.varb("totalInvestment").numberValue;
    expect(upfrontInvestment).toBe(45000);
    // 200000 + 8000 + 2000 + 4000 + 6000 - 150000 - 20000 - 4000 - 1000
  });
  it("should calculate annual cash flow accurately", () => {
    const dealTester = SetterTesterSection.init("deal");

    const propertyGeneral = dealTester.setter.onlyChild("propertyGeneral");
    const property = propertyGeneral.onlyChild("property");

    const rents = [1300, 1700];
    for (const amount of rents) {
      property.addChild("unit", {
        dbVarbs: { targetRentMonthly: numObj(amount) },
      });
    }

    property.varb("taxesYearly").updateValue(numObj(1200));
    property.varb("homeInsYearly").updateValue(numObj(1200));

    const propertyCostListGroup = property.onlyChild("ongoingExpenseGroup");
    const ongoingValue = propertyCostListGroup.addAndGetChild("ongoingValue", {
      dbVarbs: { isItemized: true },
    });
    const propertyCostList = ongoingValue.onlyChild("ongoingList");
    const propertyCosts = [200, 100, 150];
    for (const amount of propertyCosts) {
      propertyCostList.addChild("ongoingItem", {
        dbVarbs: { valueEditor: numObj(amount) },
      });
    } // why is there an extra 150?

    addTestLoan(dealTester);
    // 1012.6 expense

    const mgmtGeneral = dealTester.setter.onlyChild("mgmtGeneral");
    const mgmt = mgmtGeneral.onlyChild("mgmt");
    mgmt.varb("rentCutPercentEditor").updateValue(numObj(5));
    mgmt.varb("vacancyRatePercent").updateValue(numObj(5));

    const mgmtCostListGroup = mgmt.addAndGetChild("ongoingExpenseValue", {
      dbVarbs: { isItemized: true },
    });
    const mgmtCostList = mgmtCostListGroup.onlyChild("ongoingList");
    const mgmtCosts = [100, 100];
    for (const amount of mgmtCosts) {
      mgmtCostList.addChild("ongoingItem", {
        dbVarbs: { valueEditor: numObj(amount) },
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

    // a mystery 150 is being subtracted from cashflow

    expect(cashFlowMonthly).toBe(837.4);
    expect(cashFlowYearly).toBeCloseTo(cashFlowMonthly * 12, 1);
  });
});

function addTestLoan(dealTester: SetterTesterSection<"deal">): void {
  const propertyGeneral = dealTester.setter.onlyChild("propertyGeneral");
  const property = propertyGeneral.onlyChild("property");
  property.varb("price").updateValue(numObj(200000));

  const financing = dealTester.setter.onlyChild("financing");
  const loan = financing.addAndGetChild("loan");
  loan.varb("interestRatePercentYearly").updateValue(numObj(5));
  loan.varb("loanTermYears").updateValue(numObj(30));
  loan.varb("loanBasePercentEditor").updateValue(numObj(75));
  loan.varb("mortgageInsYearly").updateValue(numObj(1200));

  const wrappedValue = loan.addAndGetChild("wrappedInLoanValue", {
    dbVarbs: { isItemized: true },
  });
  const wrapped = wrappedValue.onlyChild("singleTimeList");
  const amounts = [6000, 14000];
  for (const amount of amounts) {
    wrapped.addChild("singleTimeItem", {
      dbVarbs: { valueEditor: numObj(amount) },
    });
  }
}

function addInterestOnlyLoan(dealTester: SetterTesterSection<"deal">): void {
  const financing = dealTester.setter.onlyChild("financing");
  const loan = financing.addAndGetChild("loan");
  const calcName: PiCalculationName = "interestOnlySimple";
  loan.varb("piCalculationName").updateValue(calcName);
  loan.varb("loanBaseUnitSwitch").updateValue("dollars");
  loan.varb("loanBaseDollarsEditor").updateValue(numObj(10000));
  loan.varb("interestRatePercentYearly").updateValue(numObj(6));
}
