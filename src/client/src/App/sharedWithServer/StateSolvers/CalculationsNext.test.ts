import {
  DealMode,
  dealModes,
} from "../SectionsMeta/values/StateValue/dealMode";
import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import { switchKeyToVarbNames } from "./../SectionsMeta/allBaseSectionVarbs/baseSwitchNames";
import { SolverActiveDeal } from "./SolverActiveDeal";
import { SolverSection } from "./SolverSection";

const allDealModes = dealModes;

function addPeriodicTaxesHomeInsYearly(
  property: SolverSection<"property">,
  taxesVal: number,
  homeInsVal: number
) {
  const taxes = property.onlyChild("taxesOngoing");
  taxes.updateValues({
    valueDollarsOngoingEditor: numObj(taxesVal),
    valueDollarsOngoingSwitch: "yearly",
  });
  const homeIns = property.onlyChild("homeInsOngoing");
  homeIns.updateValues({
    valueDollarsOngoingEditor: numObj(homeInsVal),
    valueDollarsOngoingSwitch: "yearly",
  });
}

const add4200YearlyHoldingCosts = (property: SolverSection<"property">) => {
  addPeriodicTaxesHomeInsYearly(property, 2400, 1200);

  const utilityHolding = property.onlyChild("utilityHolding");
  utilityHolding.updateValues({
    valueSourceName: "listTotal",
  });
  const ongoingList = utilityHolding.onlyChild("ongoingList");
  ongoingList.addChildAndSolve("ongoingItem", {
    sectionValues: {
      valueOngoingEditor: numObj(400),
      valueOngoingSwitch: "yearly",
      valueSourceName: "valueEditor",
    },
  });

  const holdingCost = property.onlyChild("miscHoldingCost");
  holdingCost.updateValues({
    valueSourceName: "valueDollarsOngoingEditor",
    valueDollarsOngoingEditor: numObj(200),
    valueDollarsOngoingSwitch: "yearly",
  });
};

type OngoingSectionName =
  | "miscOngoingCost"
  | "miscRevenueValue"
  | "miscHoldingCost"
  | "maintenanceValue"
  | "capExValue";
const addOngoing = <SN extends OngoingSectionName>(
  section: SolverSection<SN>,
  amount: number,
  switchVal: "yearly" | "monthly"
) => {
  (section as any as SolverSection<OngoingSectionName>).updateValues({
    valueSourceName: "valueDollarsOngoingEditor",
    valueDollarsOngoingSwitch: switchVal,
    valueDollarsOngoingEditor: numObj(amount),
  });
};

describe("Property calculations", () => {
  const getProperty = (dealMode: DealMode) =>
    SolverActiveDeal.init(dealMode).property;

  const forEveryDealModeWithProperty = (
    test: (property: SolverSection<"property">) => void,
    dealModes: readonly DealMode[] = allDealModes
  ) => {
    for (const dealMode of dealModes) {
      const property = getProperty(dealMode);
      test(property);
    }
  };

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

  const add6400Rent = (property: SolverSection<"property">) => {
    const unitRents = [2000, 2100, 2300] as const;
    for (const rent of unitRents) {
      property.addChildAndSolve("unit", {
        sectionValues: {
          targetRentOngoingEditor: numObj(rent),
          targetRentOngoingSwitch: "monthly",
        },
      });
    }
  };
  it("should calculate targetRent", () => {
    const property = getProperty("buyAndHold");
    add6400Rent(property);
    expect(property.numValue("targetRentMonthly")).toBe(6400);
    expect(property.numValue("targetRentYearly")).toBe(6400 * 12);
  }),
    it("should calculate revenue", () => {
      const property = getProperty("buyAndHold");
      add6400Rent(property);
      const value = property.onlyChild("miscRevenueValue");
      value.updateValues({
        valueSourceName: "valueDollarsOngoingEditor",
        valueDollarsOngoingSwitch: "monthly",
        valueDollarsOngoingEditor: numObj(1200),
      });
      expect(property.numValue("revenueMonthly")).toBe(7600);
      expect(property.numValue("revenueYearly")).toBe(7600 * 12);
    });
  it("should calculate sellingCosts", () => {
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

  type OnetimeCostSN =
    | "miscOnetimeCost"
    | "repairValue"
    | "costOverrunValue"
    | "sellingCostValue";
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
  it("should calculate repairValue", () => {
    testOnetimeValue("repairValue", "rehabCostBase");
  });
  it("should calculate miscOneTimeCosts", () => {
    testOnetimeValue("miscOnetimeCost", "miscOnetimeCosts");
  });
  it("should calculate rehabBaseCost", () => {
    forEveryDealModeWithProperty((property) => {
      setOnetimeEditor(property.onlyChild("repairValue"), 9000);
      setOnetimeEditor(property.onlyChild("miscOnetimeCost"), 1000);
      expect(property.numValue("rehabCostBase")).toBe(10000);
    });
  });
  it("should calculate costOverrun", () => {
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

      setOnetimeEditor(property.onlyChild("repairValue"), 500);
      setOnetimeEditor(property.onlyChild("miscOnetimeCost"), 300);
      setOnetimeEditor(property.onlyChild("costOverrunValue"), 200);

      expect(property.numValue("rehabCostBase")).toBe(800);
      expect(property.numValue("rehabCost")).toBe(1000);
    }
  });
  it("should calculate upfrontExpenses", () => {
    forEveryDealModeWithProperty((property) => {
      const values = {
        homeBuyer: 201000,
        buyAndHold: 201000,
        fixAndFlip: 215200,
        brrrr: 215200,
      } as const;

      property.updateValues({
        purchasePrice: numObj(200000),
      });

      setOnetimeEditor(property.onlyChild("repairValue"), 500);
      setOnetimeEditor(property.onlyChild("miscOnetimeCost"), 300);
      setOnetimeEditor(property.onlyChild("costOverrunValue"), 200);

      setOnetimeEditor(property.onlyChild("sellingCostValue"), 10000);

      add4200YearlyHoldingCosts(property);
      property.updateValues({
        holdingPeriodSpanEditor: numObj(12),
        holdingPeriodSpanSwitch: "months",
      });

      expect(property.numValue("upfrontExpenses")).toBe(
        values[property.value("propertyMode")]
      );
    });
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
    addOngoing(value, 100, "monthly");
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
  it("should calculate ongoing expenses", () => {
    const property = getProperty("buyAndHold");
    addPeriodicTaxesHomeInsYearly(property, 2400, 1200);

    const utilityOngoing = property.onlyChild("utilityOngoing");
    utilityOngoing.updateValues({
      valueSourceName: "listTotal",
    });
    const ongoingList = utilityOngoing.onlyChild("ongoingList");
    ongoingList.addChildAndSolve("ongoingItem", {
      sectionValues: {
        valueOngoingEditor: numObj(600),
        valueOngoingSwitch: "yearly",
        valueSourceName: "valueEditor",
      },
    });

    addOngoing(property.onlyChild("miscOngoingCost"), 1500, "yearly");
    addOngoing(property.onlyChild("maintenanceValue"), 1300, "yearly");
    addOngoing(property.onlyChild("capExValue"), 5000, "yearly");

    expect(property.numValue("expensesYearly")).toBe(12000);
    expect(property.numValue("expensesMonthly")).toBe(12000 / 12);
  });
  it("should calculate ongoing holding costs", () => {
    const property = getProperty("fixAndFlip");
    const test = (num: number) => {
      expect(property.numValue("holdingCostYearly")).toBe(num);
      expect(property.numValue("holdingCostMonthly")).toBe(num / 12);
    };
    add4200YearlyHoldingCosts(property);
    test(4200);
  });
  it("should calculate total holding costs", () => {
    const property = getProperty("fixAndFlip");
    const test = (num: number) => {
      expect(property.numValue("holdingCostTotal")).toBe(num);
    };

    add4200YearlyHoldingCosts(property);

    const holdingPeriod = 6;
    property.updateValues({
      holdingPeriodSpanEditor: numObj(holdingPeriod),
      holdingPeriodSpanSwitch: "months",
    });

    const holdingCostsMonthly = 4200 / 12;
    test(holdingCostsMonthly * holdingPeriod);
  });
});
