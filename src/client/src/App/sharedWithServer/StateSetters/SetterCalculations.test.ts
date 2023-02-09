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
    property.varb("price").updateValue(numObj(200000));

    const propertyCostListGroup = property.onlyChild("upfrontExpenseGroup");
    const propertyCostValue = propertyCostListGroup.addAndGetChild(
      "singleTimeValue",
      { dbVarbs: { valueSourceSwitch: "itemized" } }
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
    financing.varb("financingMode").updateValue("useLoan");
    const loan = financing.addAndGetChild("loan");
    loan.varb("loanBasePercentEditor").updateValue(numObj(0));

    const wrappedValue = loan.addAndGetChild("wrappedInLoanValue");
    wrappedValue.updateValues({
      valueSourceSwitch: "lumpSum",
      valueEditor: numObj(5000),
    });

    const mgmt = dealTester.setter.onlyChild("mgmt");
    const expenseGroup = mgmt.onlyChild("upfrontExpenseGroup");
    const expenseValue = expenseGroup.addAndGetChild("singleTimeValue", {
      dbVarbs: { valueSourceSwitch: "itemized" },
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
    const dealTester = SetterTesterSection.initActiveDeal();
    const property = dealTester.setter.onlyChild("property");

    const rents = [1300, 1700];
    for (const amount of rents) {
      property.addChild("unit", {
        dbVarbs: {
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
      dbVarbs: { valueSourceSwitch: "itemized" },
    });
    const propertyCostList = ongoingValue.onlyChild("ongoingList");
    const propertyCosts = [200, 100, 150];
    for (const amount of propertyCosts) {
      propertyCostList.addChild("ongoingItem", {
        dbVarbs: {
          valueOngoingSwitch: "monthly",
          valueSourceSwitch: "labeledEquation",
          valueEditor: numObj(amount),
        },
      });
    }

    addTestLoan(dealTester);
    const financing = dealTester.setter.onlyChild("financing");
    financing.varb("financingMode").updateValue("useLoan");
    // 1012.6 expense

    const mgmt = dealTester.setter.onlyChild("mgmt");
    mgmt.varb("basePayPercentEditor").updateValue(numObj(5));
    mgmt.varb("vacancyLossPercentEditor").updateValue(numObj(5));

    const expenseGroup = mgmt.onlyChild("ongoingExpenseGroup");
    const mgmtCostListGroup = expenseGroup.addAndGetChild("ongoingValue", {
      dbVarbs: { valueSourceSwitch: "itemized" },
    });
    const mgmtCostList = mgmtCostListGroup.onlyChild("ongoingList");
    const mgmtCosts = [100, 100];
    for (const amount of mgmtCosts) {
      mgmtCostList.addChild("ongoingItem", {
        dbVarbs: {
          valueOngoingSwitch: "monthly",
          valueSourceSwitch: "labeledEquation",
          valueEditor: numObj(amount),
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
  property.varb("price").updateValue(numObj(200000));

  const financing = dealTester.setter.onlyChild("financing");
  financing.varb("financingMode").updateValue("useLoan");

  const loan = financing.addAndGetChild("loan");
  loan.varb("interestRatePercentOngoingSwitch").updateValue("yearly");
  loan.varb("interestRatePercentOngoingEditor").updateValue(numObj(5));

  loan.varb("loanTermSpanSwitch").updateValue("years");
  loan.varb("loanTermSpanEditor").updateValue(numObj(30));

  loan.varb("loanBaseUnitSwitch").updateValue("percent");
  loan.varb("loanBasePercentEditor").updateValue(numObj(75));

  loan.varb("hasMortgageIns").updateValue(true);
  loan.varb("mortgageInsOngoingEditor").updateValue(numObj(1200));

  const wrappedValue = loan.addAndGetChild("wrappedInLoanValue", {
    dbVarbs: { valueSourceSwitch: "itemized" },
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
  financing.varb("financingMode").updateValue("useLoan");

  const loan = financing.addAndGetChild("loan");
  loan.varb("isInterestOnly").updateValue(true);

  loan.varb("loanBaseUnitSwitch").updateValue("dollars");
  loan.varb("loanBaseDollarsEditor").updateValue(numObj(10000));

  loan.varb("interestRatePercentOngoingSwitch").updateValue("yearly");
  loan.varb("interestRatePercentOngoingEditor").updateValue(numObj(6));
}
