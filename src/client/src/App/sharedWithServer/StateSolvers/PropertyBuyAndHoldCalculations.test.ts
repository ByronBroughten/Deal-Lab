import { switchKeyToVarbNames } from "../SectionsMeta/allBaseSectionVarbs/baseSwitchNames";
import { VarbName } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import { SolverSection } from "./SolverSection";
import {
  addOngoingTaxesHomeInsYearly,
  addRents,
  makeTestProperty,
  setOnetimeEditor,
  setOnetimeList,
  setPeriodicEditor,
  setPeriodicList,
  setRehabCostBase,
} from "./testUtils";

describe("Property buy and hold calculations", () => {
  let property: SolverSection<"property">;
  const testPropertyVarb = (varbName: VarbName<"property">, num: number) => {
    expect(property.numValue(varbName)).toBe(num);
  };

  const testPropertyVarbPeriodic = (
    baseName: "miscOngoingRevenue" | "miscOngoingCosts" | "holdingCost",
    num: number
  ) => {
    const varbNames = switchKeyToVarbNames(baseName, "periodic");
    expect(property.numValue(varbNames.monthly)).toBe(num);
    expect(property.numValue(varbNames.yearly)).toBe(num * 12);
  };

  beforeEach(() => {
    property = makeTestProperty("buyAndHold");
  });

  it("should calculate buyAndHold numUnits", () => {
    const numUnits = 3;
    for (let i = 0; i < numUnits; i++) {
      property.addChildAndSolve("unit");
    }
    expect(property.numValue("numUnits")).toBe(numUnits + 1);
    // 1 is the default
  });
  it("should calculate targetRent", () => {
    const total = addRents(property, [2000, 2100, 2300]);
    expect(property.numValue("targetRentMonthly")).toBe(total);
    expect(property.numValue("targetRentYearly")).toBe(total * 12);
  }),
    it("should calculate revenue", () => {
      const rentTotal = addRents(property, [2000, 2100, 2300]);
      const miscTotal = 1200;
      const misc = property.onlyChild("miscOngoingRevenue");
      misc.updateValues({
        valueSourceName: "valueDollarsPeriodicEditor",
        valueDollarsPeriodicSwitch: "monthly",
        valueDollarsPeriodicEditor: numObj(miscTotal),
      });

      const total = rentTotal + miscTotal;
      expect(property.numValue("revenueOngoingMonthly")).toBe(total);
      expect(property.numValue("revenueOngoingYearly")).toBe(total * 12);
    });
  it("should calculate miscOnetimeCosts value", () => {
    const onetimeCost = property.onlyChild("miscOnetimeCost");
    const editorValue = setOnetimeEditor(onetimeCost, 2000);
    testPropertyVarb("miscOnetimeCosts", editorValue);

    const total = setOnetimeList(onetimeCost, [200, 300, 500]);
    testPropertyVarb("miscOnetimeCosts", total);
  });
  it("should calculate repairValue value", () => {
    const onetimeCost = property.onlyChild("repairValue");
    const editorValue = setOnetimeEditor(onetimeCost, 2000);
    testPropertyVarb("rehabCostBase", editorValue);

    const total = setOnetimeList(onetimeCost, [200, 300, 500]);
    testPropertyVarb("rehabCostBase", total);
  });
  it("should calculate rehabBaseCost", () => {
    setRehabCostBase(property, 9000, 1000);
    expect(property.numValue("rehabCostBase")).toBe(10000);
  });
  it("should calculate costOverrun", () => {
    const overrun = property.onlyChild("costOverrunValue");
    const test = (num: number) => {
      expect(overrun.numValue("valueDollars")).toBe(num);
    };

    overrun.updateValues({
      valueSourceName: "valueDollarsEditor",
      valueDollarsEditor: numObj(1500),
    });
    test(1500);

    setRehabCostBase(property, 9000, 1000);
    overrun.updateValues({
      valueSourceName: "valuePercentEditor",
      valuePercentEditor: numObj(10),
    });
    test(1000);
  });
  it("should calculate rehabCost values correctly", () => {
    setOnetimeEditor(property.onlyChild("repairValue"), 500);
    setOnetimeEditor(property.onlyChild("miscOnetimeCost"), 300);
    setOnetimeEditor(property.onlyChild("costOverrunValue"), 200);

    expect(property.numValue("rehabCostBase")).toBe(800);
    expect(property.numValue("rehabCost")).toBe(1000);
  });
  it("should calculate upfrontExpenses", () => {
    property.updateValues({ purchasePrice: numObj(200000) });
    setOnetimeEditor(property.onlyChild("repairValue"), 500);
    setOnetimeEditor(property.onlyChild("miscOnetimeCost"), 300);
    setOnetimeEditor(property.onlyChild("costOverrunValue"), 200);
    setOnetimeEditor(property.onlyChild("sellingCostValue"), 10000);
    addOngoingTaxesHomeInsYearly(property, 2400, 1200);

    property.updateValues({
      holdingPeriodSpanEditor: numObj(12),
      holdingPeriodSpanSwitch: "months",
    });
    expect(property.numValue("upfrontExpenses")).toBe(201000);
  });
  it("should calculate miscOngoingCosts periodic", () => {
    setPeriodicEditor(property.onlyChild("miscOngoingCost"), 500, "monthly");
    testPropertyVarbPeriodic("miscOngoingCosts", 500);
    setPeriodicList(
      property.onlyChild("miscOngoingCost"),
      [200, 100, 50],
      "monthly"
    );
    testPropertyVarbPeriodic("miscOngoingCosts", 350);
  });
  it("should calculate miscOngoingRevenue periodic", () => {
    setPeriodicEditor(property.onlyChild("miscOngoingRevenue"), 500, "monthly");
    testPropertyVarbPeriodic("miscOngoingRevenue", 500);
    setPeriodicList(
      property.onlyChild("miscOngoingRevenue"),
      [200, 100, 50],
      "monthly"
    );
    testPropertyVarbPeriodic("miscOngoingRevenue", 350);
  });
  it("should calculate periodic expenses", () => {
    addOngoingTaxesHomeInsYearly(property, 2400, 1200);
    setPeriodicList(property.onlyChild("utilityOngoing"), [600], "yearly");
    setPeriodicEditor(property.onlyChild("miscOngoingCost"), 1500, "yearly");
    setPeriodicEditor(property.onlyChild("maintenanceOngoing"), 1300, "yearly");
    setPeriodicEditor(property.onlyChild("capExValueOngoing"), 5000, "yearly");
    expect(property.numValue("expensesOngoingYearly")).toBe(12000);
    expect(property.numValue("expensesOngoingMonthly")).toBe(12000 / 12);
  });
});
