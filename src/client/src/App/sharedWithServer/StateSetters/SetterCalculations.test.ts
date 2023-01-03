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
    const propertyCostListGroup = property.addAndGetChild(
      "upfrontExpenseGroup"
    );

    const propertyCostList =
      propertyCostListGroup.addAndGetChild("singleTimeList");
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

    const group = loan.addAndGetChild("wrappedInLoanValue");
    const wrapped = group.addAndGetChild("singleTimeList");
    const wrappeds = [4000, 1000];
    for (const amount of wrappeds) {
      wrapped.addChild("singleTimeItem", {
        dbVarbs: { valueEditor: numObj(amount) },
      });
    }

    const mgmtGeneral = dealTester.setter.onlyChild("mgmtGeneral");
    const mgmt = mgmtGeneral.addAndGetChild("mgmt");

    const mgmtCostListGroup = mgmt.addAndGetChild("upfrontExpenseGroup");

    const mgmtCostList = mgmtCostListGroup.addAndGetChild("singleTimeList");
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
    addTestLoan(dealTester);
    // 1012.6 expense

    const propertyGeneral = dealTester.setter.onlyChild("propertyGeneral");
    const property = propertyGeneral.onlyChild("property");
    property.varb("taxesYearly").updateValue(numObj(1200));
    property.varb("homeInsYearly").updateValue(numObj(1200));

    const rents = [1300, 1700];
    for (const amount of rents) {
      property.addChild("unit", {
        dbVarbs: { targetRentMonthly: numObj(amount) },
      });
    }

    const propertyCostListGroup = property.addAndGetChild(
      "ongoingCostListGroup"
    );
    const propertyCostList =
      propertyCostListGroup.addAndGetChild("ongoingList");
    const propertyCosts = [200, 100, 150];
    for (const amount of propertyCosts) {
      propertyCostList.addChild("ongoingItem", {
        dbVarbs: { valueEditor: numObj(amount) },
      });
    }

    const mgmtGeneral = dealTester.setter.onlyChild("mgmtGeneral");
    const mgmt = mgmtGeneral.addAndGetChild("mgmt");
    mgmt.varb("rentCutPercentEditor").updateValue(numObj(5));
    mgmt.varb("vacancyRatePercent").updateValue(numObj(5));

    const mgmtCostListGroup = mgmt.addAndGetChild("ongoingCostListGroup");
    const mgmtCostList = mgmtCostListGroup.addAndGetChild("ongoingList");
    const mgmtCosts = [100, 100];
    for (const amount of mgmtCosts) {
      mgmtCostList.addChild("ongoingItem", {
        dbVarbs: { valueEditor: numObj(amount) },
      });
    }

    const cashFlowMonthly = dealTester.get.varb("cashFlowMonthly").numberValue;
    const cashFlowYearly = dealTester.get.varb("cashFlowYearly").numberValue;

    // 1700 + 1300 - 1012.6 - 100 - 100 - 200 - 100 - 150  - 100 - 100 - 150 - 150
    expect(cashFlowMonthly).toBe(837.4);
    expect(cashFlowYearly).toBeCloseTo(cashFlowMonthly * 12, 1);
  });
  // To test ROI, just break up the other two tests.
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

  const wrappedGroup = loan.addAndGetChild("wrappedInLoanValue");
  const wrapped = wrappedGroup.addAndGetChild("singleTimeList");
  wrapped.addChild("singleTimeItem", {
    dbVarbs: { valueEditor: numObj(6000) },
  });
  wrapped.addChild("singleTimeItem", {
    dbVarbs: { valueEditor: numObj(14000) },
  });
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
