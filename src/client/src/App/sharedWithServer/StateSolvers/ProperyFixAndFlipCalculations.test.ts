import { switchKeyToVarbNames } from "../SectionsMeta/allBaseSectionVarbs/baseSwitchNames";
import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import { SolverSection } from "./SolverSection";
import {
  addHoldingTaxesHomeInsYearly,
  makeTestProperty,
  setOnetimeEditor,
  setPeriodicEditor,
  setPeriodicList,
} from "./testUtils";

describe("Property fix and flip calculations", () => {
  let property: SolverSection<"property">;
  const testPropertyVarbPeriodic = (
    baseName: "miscOngoingRevenue" | "miscOngoingCosts" | "holdingCost",
    num: number
  ) => {
    const varbNames = switchKeyToVarbNames(baseName, "periodic");
    expect(property.numValue(varbNames.monthly)).toBe(num);
    expect(property.numValue(varbNames.yearly)).toBe(num * 12);
  };
  beforeEach(() => {
    property = makeTestProperty("fixAndFlip");
  });
  it("should calculate fixAndFlip numUnits", () => {
    const numUnits = 2;
    property.updateValuesAndSolve({ numUnitsEditor: numObj(numUnits) });
    expect(property.numValue("numUnits")).toBe(numUnits);
  });
  it("should calculate sellingCosts", () => {
    const sellingCosts = property.onlyChild("sellingCostValue");
    const testSellingCostDollars = (num: number) => {
      expect(property.numValue("sellingCosts")).toBe(num);
    };

    property.updateValues({ afterRepairValueEditor: numObj(100000) });
    sellingCosts.updateValues({ valueSourceName: "sixPercent" });
    testSellingCostDollars(6000);

    sellingCosts.updateValues({
      valueSourceName: "valueDollarsEditor",
      valueDollarsEditor: numObj(8000),
    });
    testSellingCostDollars(8000);

    sellingCosts.updateValues({
      valueSourceName: "valuePercentEditor",
      valuePercentEditor: numObj(5),
    });
    testSellingCostDollars(5000);

    sellingCosts.updateValues({ valueSourceName: "listTotal" });
    const list = sellingCosts.onlyChild("onetimeList");
    const listItems = [1000, 1500, 2000, 2500];
    for (const num of listItems) {
      list.addChildAndSolve("onetimeItem", {
        sectionValues: {
          valueSourceName: "valueDollarsEditor",
          valueEditor: numObj(num),
        },
      });
    }
    testSellingCostDollars(7000);
  });
  it("should calculate upfrontExpenses", () => {
    property.updateValues({ purchasePrice: numObj(200000) });

    setOnetimeEditor(property.onlyChild("repairValue"), 500);
    setOnetimeEditor(property.onlyChild("miscOnetimeCost"), 300);
    setOnetimeEditor(property.onlyChild("costOverrunValue"), 200);
    setOnetimeEditor(property.onlyChild("sellingCostValue"), 10000);
    addHoldingTaxesHomeInsYearly(property, 2400, 1200);

    property.updateValues({
      holdingPeriodSpanEditor: numObj(12),
      holdingPeriodSpanSwitch: "months",
    });

    expect(property.numValue("upfrontExpenses")).toBe(214600);
  });
  it("should calculate periodic miscHoldingCosts", () => {
    setPeriodicEditor(property.onlyChild("miscHoldingCost"), 500, "monthly");
    testPropertyVarbPeriodic("holdingCost", 500);
    setPeriodicList(
      property.onlyChild("miscHoldingCost"),
      [200, 100, 50],
      "monthly"
    );
    testPropertyVarbPeriodic("holdingCost", 350);
  });
  function add4200YearlyHoldingCosts() {
    addHoldingTaxesHomeInsYearly(property, 2400, 1200);
    setPeriodicList(property.onlyChild("utilityHolding"), [400], "yearly");
    setPeriodicEditor(property.onlyChild("miscHoldingCost"), 200, "yearly");
  }
  it("should calculate periodic holding costs", () => {
    const testYearly = (num: number) => {
      expect(property.numValue("holdingCostYearly")).toBe(num);
      expect(property.numValue("holdingCostMonthly")).toBe(num / 12);
    };
    add4200YearlyHoldingCosts();
    testYearly(4200);
  });
  it("should calculate total holding costs", () => {
    const test = (num: number) => {
      expect(property.numValue("holdingCostTotal")).toBe(num);
    };
    add4200YearlyHoldingCosts();
    const holdingPeriod = 6;
    property.updateValues({
      holdingPeriodSpanEditor: numObj(holdingPeriod),
      holdingPeriodSpanSwitch: "months",
    });

    const holdingCostsMonthly = 4200 / 12;
    test(holdingCostsMonthly * holdingPeriod);
  });
});
