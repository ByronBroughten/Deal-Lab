import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import {
  DealMode,
  dealModes,
} from "../SectionsMeta/values/StateValue/unionValues";
import { switchKeyToVarbNames } from "./../SectionsMeta/allBaseSectionVarbs/baseSwitchNames";
import { SolverActiveDeal } from "./SolverActiveDeal";
import { SolverSection } from "./SolverSection";

describe("Property calculations", () => {
  const getProperty = (dealMode: DealMode) =>
    SolverActiveDeal.init(dealMode).property;
  it("should calculate buyAndHold numUnits", () => {
    const property = getProperty("buyAndHold");
    const numUnits = 3;
    for (let i = 0; i < numUnits; i++) {
      property.addChildAndSolve("unit");
    }
    expect(property.numValue("numUnits")).toBe(numUnits);
  });
  it("should calculate fixAndFlip numUnits", () => {
    const property = getProperty("fixAndFlip");
    const numUnits = 2;
    property.updateValuesAndSolve({ numUnitsEditor: numObj(numUnits) });
    expect(property.numValue("numUnits")).toBe(numUnits);
  });
  it("should calculate sellingCosts correctly", () => {
    const property = getProperty("fixAndFlip");
    const sellingCosts = property.onlyChild("sellingCostValue");

    const testDollars = (num: number) => {
      expect(property.numValue("sellingCosts")).toBe(num);
    };

    property.updateValues({ afterRepairValue: numObj(100000) });
    sellingCosts.updateValues({ valueSourceName: "sixPercent" });
    testDollars(6000);

    sellingCosts.updateValues({
      valueSourceName: "valueDollarsEditor",
      valueDollarsEditor: numObj(8000),
    });
    testDollars(8000);

    sellingCosts.updateValues({
      valueSourceName: "valuePercentEditor",
      valuePercentEditor: numObj(5),
    });
    testDollars(5000);

    sellingCosts.updateValues({ valueSourceName: "itemize" });
    const list = sellingCosts.onlyChild("onetimeList");
    const listItems = [1000, 1500, 2000, 2500];
    for (const num of listItems) {
      list.addChildAndSolve("singleTimeItem", {
        sectionValues: {
          valueSourceName: "valueEditor",
          valueEditor: numObj(num),
        },
      });
    }
    testDollars(7000);
  });

  type OnetimeCostSN = "miscOnetimeCost" | "repairValue" | "costOverrunValue";
  const setOnetimeEditor = <SN extends OnetimeCostSN>(
    onetime: SolverSection<SN>,
    num: number
  ) => {
    (
      onetime as SolverSection<any> as SolverSection<OnetimeCostSN>
    ).updateValues({
      valueSourceName: "valueDollarsEditor",
      valueDollarsEditor: numObj(num),
    });
  };

  const testOnetimeValue = (
    sectionName: "miscOnetimeCost" | "repairValue",
    varbName: "miscOnetimeCosts" | "rehabCostBase"
  ) => {
    for (const dealMode of ["buyAndHold", "fixAndFlip"] as const) {
      const property = getProperty(dealMode);
      const test = (num: number) => {
        expect(property.numValue(varbName)).toBe(num);
      };
      const onetimeCost = property.onlyChild(sectionName);
      setOnetimeEditor(onetimeCost, 2000);
      test(2000);

      onetimeCost.updateValues({ valueSourceName: "listTotal" });
      const list = onetimeCost.onlyChild("onetimeList");
      const listItems = [200, 300, 500];
      for (const item of listItems) {
        list.addChildAndSolve("singleTimeItem", {
          sectionValues: {
            valueSourceName: "valueEditor",
            valueEditor: numObj(item),
          },
        });
      }
      test(1000);
    }
  };
  it("should calculate repairValue correctly", () => {
    testOnetimeValue("repairValue", "rehabCostBase");
  });
  it("should calculate miscOneTimeCosts correctly", () => {
    testOnetimeValue("miscOnetimeCost", "miscOnetimeCosts");
  });
  it("should calculate costOverrun correctly", () => {
    for (const dealMode of dealModes) {
      const property = getProperty(dealMode);
      const overrun = property.onlyChild("costOverrunValue");
      const test = (num: number) => {
        expect(overrun.numValue("valueDollars")).toBe(num);
      };

      overrun.updateValues({
        valueSourceName: "valueDollarsEditor",
        valueDollarsEditor: numObj(1500),
      });
      test(1500);

      const repairValue = property.onlyChild("repairValue");
      setOnetimeEditor(repairValue, 9000);
      const onetime = property.onlyChild("miscOnetimeCost");
      setOnetimeEditor(onetime, 1000);
      overrun.updateValues({
        valueSourceName: "valuePercentEditor",
        valuePercentEditor: numObj(10),
      });
      test(1000);
    }
  });
  it("should calculate rehabCost values correctly", () => {
    for (const dealMode of dealModes) {
      const property = getProperty(dealMode);

      const repairValue = property.onlyChild("repairValue");
      setOnetimeEditor(repairValue, 500);
      const onetime = property.onlyChild("miscOnetimeCost");
      setOnetimeEditor(onetime, 300);
      const overrun = property.onlyChild("costOverrunValue");
      setOnetimeEditor(overrun, 200);

      expect(property.numValue("rehabCostBase")).toBe(800);
      expect(property.numValue("rehabCost")).toBe(1000);
    }
  });
  const testOngoing = (
    dealMode: DealMode,
    baseName: "miscRevenue" | "miscCosts" | "holdingCost",
    childName: "miscRevenueValue" | "miscOngoingCost" | "miscHoldingCost"
  ) => {
    const property = getProperty(dealMode);
    const varbNames = switchKeyToVarbNames(baseName, "ongoing");

    const test = (num: number) => {
      expect(property.numValue(varbNames.monthly)).toBe(num);
      expect(property.numValue(varbNames.yearly)).toBe(num * 12);
    };

    const value = property.onlyChild(childName);
    value.updateValues({
      valueSourceName: "valueDollarsEditor",
      valueDollarsOngoingSwitch: "monthly",
      valueDollarsOngoingEditor: numObj(100),
    });
    test(100);

    value.updateValues({ valueSourceName: "listTotal" });
    const list = value.onlyChild("ongoingList");
    const listItems = [200, 100, 100];
    for (const item of listItems) {
      list.addAndGetChild("ongoingItem", {
        sectionValues: {
          valueSourceName: "valueEditor",
          valueOngoingSwitch: "monthly",
          valueOngoingEditor: numObj(item),
        },
      });
    }
    test(400);
  };
  it("should calculate ongoing miscHoldingCosts", () => {
    testOngoing("fixAndFlip", "holdingCost", "miscHoldingCost");
  });
  it("should calculate ongoing miscCosts", () => {
    testOngoing("buyAndHold", "miscCosts", "miscOngoingCost");
  });
  it("should calculate ongoing miscRevenue", () => {
    testOngoing("buyAndHold", "miscRevenue", "miscRevenueValue");
  });

  const add4200YearlyClosingCosts = (property: SolverSection<"property">) => {
    property.updateValues({
      taxesOngoingEditor: numObj(2400),
      taxesOngoingSwitch: "yearly",
      homeInsOngoingEditor: numObj(1200),
      homeInsOngoingSwitch: "yearly",
    });
    const utilityValue = property.onlyChild("utilityValue");
    utilityValue.updateValues({
      valueSourceName: "listTotal",
    });
    const ongoingList = utilityValue.onlyChild("ongoingList");
    ongoingList.addChildAndSolve("ongoingItem", {
      sectionValues: {
        valueOngoingEditor: numObj(400),
        valueOngoingSwitch: "yearly",
        valueSourceName: "valueEditor",
      },
    });

    const holdingCost = property.onlyChild("miscHoldingCost");
    holdingCost.updateValues({
      valueSourceName: "valueDollarsEditor",
      valueDollarsOngoingEditor: numObj(200),
      valueDollarsOngoingSwitch: "yearly",
    });
  };
  it("should calculate ongoing holding costs", () => {
    const property = getProperty("fixAndFlip");
    const test = (num: number) => {
      expect(property.numValue("holdingCostYearly")).toBe(num);
      expect(property.numValue("holdingCostMonthly")).toBe(num / 12);
    };
    add4200YearlyClosingCosts(property);
    test(4200);
  });
  it("should calculate total holding costs", () => {
    const property = getProperty("fixAndFlip");
    const test = (num: number) => {
      expect(property.numValue("holdingCostTotal")).toBe(num);
    };

    add4200YearlyClosingCosts(property);

    const holdingPeriod = 6;
    property.updateValues({
      holdingPeriodSpanEditor: numObj(holdingPeriod),
      holdingPeriodSpanSwitch: "months",
    });

    const holdingCostsMonthly = 4200 / 12;
    test(holdingCostsMonthly * holdingPeriod);
  });
  it("should calculate rehabBaseCost", () => {});
  it("should calculate costOverrun", () => {});
});
