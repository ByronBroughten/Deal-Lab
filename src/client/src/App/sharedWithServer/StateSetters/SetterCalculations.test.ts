import { numObj } from "../SectionsMeta/baseSectionsUtils/baseValues/NumObj";
import { SetterTesterSection } from "./TestUtils/SetterTesterSection";

describe("SetterCalculations", () => {
  it("should calculate loan payments accurately", () => {
    const dealTester = SetterTesterSection.init("deal");
    addTestLoan(dealTester);
    const financing = dealTester.setter.onlyChild("financing");

    const expectedLoanPayment = 912.6;
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
    property.varb("price").updateValueDirectly(numObj(200000));

    const costList = property.addAndGetChild("upfrontCostList");
    const costs = [8000, 2000];
    for (const amount of costs) {
      costList.addChild("singleTimeItem", {
        dbVarbs: { numObjEditor: numObj(amount) },
      });
    }

    addTestLoan(dealTester);

    const financing = dealTester.setter.onlyChild("financing");
    const loan = financing.addAndGetChild("loan");

    const wrapped = loan.addAndGetChild("wrappedInLoanList");
    const wrappeds = [4000, 1000];
    for (const amount of wrappeds) {
      wrapped.addChild("singleTimeItem", {
        dbVarbs: { numObjEditor: numObj(amount) },
      });
    }

    const mgmtGeneral = dealTester.setter.onlyChild("mgmtGeneral");
    const mgmt = mgmtGeneral.onlyChild("mgmt");
    const upfront = mgmt.addAndGetChild("upfrontCostList");
    const mgmtCosts = [4000, 6000];
    for (const amount of mgmtCosts) {
      upfront.addChild("singleTimeItem", {
        dbVarbs: { numObjEditor: numObj(amount) },
      });
    }

    const upfrontInvestment =
      dealTester.get.varb("upfrontExpenses").numberValue;
    expect(upfrontInvestment).toBe(45000);
    // 200000 + 8000 + 2000 + 4000 + 6000 - 150000 - 20000 - 4000 - 1000
  });
  it("should calculate annual cash flow accurately", () => {
    const dealTester = SetterTesterSection.init("deal");
    addTestLoan(dealTester);
    // 1012.6 expense

    const propertyGeneral = dealTester.setter.onlyChild("propertyGeneral");
    const property = propertyGeneral.onlyChild("property");
    property.varb("taxesYearly").updateValueDirectly(numObj(1200));
    property.varb("homeInsYearly").updateValueDirectly(numObj(1200));

    const rents = [1300, 1700];
    for (const amount of rents) {
      property.addChild("unit", {
        dbVarbs: { targetRentMonthly: numObj(amount) },
      });
    }

    const propertyCostList = property.addAndGetChild("ongoingCostList");
    const propertyCosts = [200, 100, 150];
    for (const amount of propertyCosts) {
      propertyCostList.addChild("ongoingItem", {
        dbVarbs: { numObjEditor: numObj(amount) },
      });
    }

    const mgmtGeneral = dealTester.setter.onlyChild("mgmtGeneral");
    const mgmt = mgmtGeneral.onlyChild("mgmt");
    mgmt.varb("rentCutPercent").updateValueDirectly(numObj(5));
    mgmt.varb("vacancyRatePercent").updateValueDirectly(numObj(5));

    const mgmtCostList = mgmt.addAndGetChild("ongoingCostList");
    const mgmtCosts = [100, 100];
    for (const amount of mgmtCosts) {
      mgmtCostList.addChild("ongoingItem", {
        dbVarbs: { numObjEditor: numObj(amount) },
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
  property.varb("price").updateValueDirectly(numObj(200000));

  const financing = dealTester.setter.onlyChild("financing");
  const loan = financing.addAndGetChild("loan");
  loan.varb("interestRatePercentYearly").updateValueDirectly(numObj(5));
  loan.varb("loanTermYears").updateValueDirectly(numObj(30));
  loan.varb("loanBasePercent").updateValueDirectly(numObj(75));
  loan.varb("mortgageInsYearly").updateValueDirectly(numObj(1200));

  const wrapped = loan.addAndGetChild("wrappedInLoanList");
  wrapped.addChild("singleTimeItem", {
    dbVarbs: { numObjEditor: numObj(6000) },
  });
  wrapped.addChild("singleTimeItem", {
    dbVarbs: { numObjEditor: numObj(14000) },
  });
}
