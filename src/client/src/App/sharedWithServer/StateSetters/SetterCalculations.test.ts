import { numObj } from "../SectionsMeta/baseSectionsUtils/baseValues/NumObj";
import { SetterTesterSection } from "./TestUtils/SetterTesterSection";

describe("SetterCalculations", () => {
  it("should calculate principal and interest accurately", () => {
    const dealTester = SetterTesterSection.init("deal");

    const propertyGeneral = dealTester.setter.onlyChild("propertyGeneral");
    const property = propertyGeneral.onlyChild("property");
    property.varb("price").updateValueDirectly(numObj(200000));

    const financing = dealTester.setter.onlyChild("financing");
    const loan = financing.addAndGetChild("loan");
    loan.varb("interestRatePercentYearly").updateValueDirectly(numObj(5));
    loan.varb("loanTermYears").updateValueDirectly(numObj(30));
    loan.varb("loanBasePercent").updateValueDirectly(numObj(75));

    loan.addChild("closingCostList", {});

    // Add some closing costs
    // Add some wrapped in loan

    const piMonthly = financing.get.varb(
      "principalAndInterestMonthly"
    ).numberValue;
    expect(piMonthly).toBe(805.23);
  });
});
