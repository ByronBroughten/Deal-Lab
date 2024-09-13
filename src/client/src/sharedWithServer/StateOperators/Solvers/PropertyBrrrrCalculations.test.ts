import { VarbName } from "../../stateSchemas/fromSchema3SectionStructures/baseSectionsVarbsTypes";
import { switchKeyToVarbNames } from "../../stateSchemas/schema3SectionStructures/baseSwitchNames";
import { numObj } from "../../stateSchemas/schema4ValueTraits/StateValue/NumObj";
import { SolverSection } from "./SolverSection";
import {
  addHoldingTaxesHomeInsYearly,
  addOngoingTaxesHomeInsYearly,
  addRents,
  makeTestProperty,
  setOnetimeEditor,
  setOnetimeList,
  setPeriodicEditor,
  setPeriodicList,
  setRehabCostBase,
} from "./testUtils";

describe("PropertyBrrrrCalculations", () => {
  let property: SolverSection<"property">;
  const testVarb = (varbName: VarbName<"property">, num: number) => {
    expect(property.numValue(varbName)).toBe(num);
  };
  const testPeriodicVarb = (
    baseName:
      | "expensesOngoing"
      | "revenueOngoing"
      | "miscOngoingCosts"
      | "holdingCost"
      | "targetRent",
    num: number
  ) => {
    const varbNames = switchKeyToVarbNames(baseName, "periodic");
    expect(property.numValue(varbNames.monthly)).toBe(num);
    expect(property.numValue(varbNames.yearly)).toBe(num * 12);
  };
  beforeEach(() => {
    property = makeTestProperty("brrrr");
  });
  it("should calculate brrrr numUnits", () => {
    const numUnits = 3;
    for (let i = 0; i < numUnits; i++) {
      property.addChildAndSolve("unit");
    }
    testVarb("numUnits", numUnits + 1); // 1 is the default unit
  });
  it("should calculate targetRent", () => {
    const total = addRents(property, [2000, 2100, 2300]);
    testPeriodicVarb("targetRent", total);
  });
  it("should calculate revenueOngoing", () => {
    const rentTotal = addRents(property, [2000, 2100, 2300]);
    const miscTotal = 1200;
    const misc = property.onlyChild("miscOngoingRevenue");
    misc.updateValues({ valueSourceName: "valueDollarsEditor" });
    const miscEditor = misc.onlyChild("valueDollarsEditor");
    miscEditor.updateValues({
      valueEditorFrequency: "monthly",
      valueEditor: numObj(miscTotal),
    });

    const total = rentTotal + miscTotal;
    testPeriodicVarb("revenueOngoing", total);
  });
  it("should calculate miscOnetimeCosts value", () => {
    const onetimeCost = property.onlyChild("miscOnetimeCost");
    const editorValue = setOnetimeEditor(onetimeCost, 2000);
    testVarb("miscOnetimeCosts", editorValue);

    const total = setOnetimeList(onetimeCost, [200, 300, 500]);
    testVarb("miscOnetimeCosts", total);
  });
  it("should calculate repairValue value", () => {
    const onetimeCost = property.onlyChild("repairValue");
    const editorValue = setOnetimeEditor(onetimeCost, 2000);
    testVarb("rehabCostBase", editorValue);

    const total = setOnetimeList(onetimeCost, [200, 300, 500]);
    testVarb("rehabCostBase", total);
  });
  it("should calculate rehabBaseCost", () => {
    setRehabCostBase(property, 9000, 1000);
    expect(property.numValue("rehabCostBase")).toBe(10000);
  });
  it("should calculate periodic expenses", () => {
    addOngoingTaxesHomeInsYearly(property, 2400, 1200);
    setPeriodicList(property.onlyChild("utilityOngoing"), [600], "yearly");
    setPeriodicEditor(property.onlyChild("miscOngoingCost"), 1500, "yearly");
    setPeriodicEditor(property.onlyChild("maintenanceOngoing"), 1300, "yearly");
    setPeriodicEditor(property.onlyChild("capExValueOngoing"), 5000, "yearly");
    testPeriodicVarb("expensesOngoing", 1000);
  });
  it("should calculate upfrontExpenses", () => {
    property.updateValues({ purchasePrice: numObj(200000) });

    setOnetimeEditor(property.onlyChild("repairValue"), 500);
    setOnetimeEditor(property.onlyChild("miscOnetimeCost"), 300);
    setOnetimeEditor(property.onlyChild("costOverrunValue"), 200);

    200000 + 500 + 300 + 200 + 2400 + 1200;

    addHoldingTaxesHomeInsYearly(property, 2400, 1200);
    property.onlyChild("holdingPeriod").updateValues({
      valueEditor: numObj(12),
      valueEditorUnit: "months",
    });
    testVarb("upfrontExpenses", 204600);
  });
});
