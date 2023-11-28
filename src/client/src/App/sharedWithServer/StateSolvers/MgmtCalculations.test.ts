import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import { SolverActiveDeal } from "./SolverActiveDeal";
import { SolverSection } from "./SolverSection";
import {
  setOnetimeEditor,
  setOnetimeList,
  setPeriodicEditor,
  setPeriodicList,
} from "./testUtils";

describe("MgmtCalculations", () => {
  let deal: SolverActiveDeal;
  let property: SolverSection<"property">;
  let mgmt: SolverSection<"mgmt">;

  beforeEach(() => {
    deal = SolverActiveDeal.init("buyAndHold");
    property = deal.property;
    mgmt = deal.mgmt;
  });

  const add1000Rent = () => {
    const unit = property.addAndGetChild("unit");
    unit.onlyChild("targetRentEditor").updateValuesAndSolve({
      valueEditor: numObj(1000),
      valueEditorFrequency: "monthly",
    });
  };

  it("should calculate vacancy loss", () => {
    add1000Rent();
    const vacancyLoss = mgmt.onlyChild("vacancyLossValue");
    const test = (monthly: number) => {
      expect(vacancyLoss.numValue("valueDollarsMonthly")).toBe(monthly);
      expect(vacancyLoss.numValue("valueDollarsYearly")).toBe(monthly * 12);
    };

    vacancyLoss.updateValues({ valueSourceName: "fivePercentRent" });
    test(50);

    vacancyLoss.updateValues({ valueSourceName: "tenPercentRent" });
    test(100);

    vacancyLoss.updateValues({ valueSourceName: "valueDollarsEditor" });
    vacancyLoss.onlyChild("valueDollarsEditor").updateValues({
      valueEditor: numObj(17),
      valueEditorFrequency: "monthly",
    });
    test(17);

    vacancyLoss.onlyChild("valueDollarsEditor").updateValues({
      valueEditorFrequency: "yearly",
      valueEditor: numObj(120),
    });
    test(10);

    vacancyLoss.updateValues({
      valueSourceName: "valuePercentEditor",
      valuePercentEditor: numObj(20),
    });
    test(200);
  });
  it("should calculate basePay", () => {
    add1000Rent();
    const basePay = mgmt.onlyChild("mgmtBasePayValue");
    const test = (monthly: number) => {
      expect(basePay.numValue("valueDollarsMonthly")).toBe(monthly);
      expect(basePay.numValue("valueDollarsYearly")).toBe(monthly * 12);
    };

    basePay.updateValues({ valueSourceName: "tenPercentRent" });
    test(100);

    basePay.updateValues({
      valueSourceName: "valuePercentEditor",
      valuePercentEditor: numObj(30),
    });
    test(300);

    basePay.updateValues({ valueSourceName: "valueDollarsEditor" });
    basePay.onlyChild("valueDollarsEditor").updateValues({
      valueEditor: numObj(10),
      valueEditorFrequency: "monthly",
    });
    test(10);

    basePay.onlyChild("valueDollarsEditor").updateValues({
      valueEditor: numObj(200),
      valueEditorFrequency: "monthly",
    });
    test(200);

    basePay.updateValues({ valueSourceName: "zero" });
    test(0);
  });
  it("should calculate misc ongoing costs", () => {
    const miscPeriodic = mgmt.onlyChild("miscOngoingCost");
    const test = (monthly: number) => {
      expect(miscPeriodic.numValue("valueDollarsMonthly")).toBe(monthly);
      expect(miscPeriodic.numValue("valueDollarsYearly")).toBe(monthly * 12);
    };

    setPeriodicEditor(miscPeriodic, 400, "monthly");
    test(400);

    setPeriodicEditor(miscPeriodic, 2400, "yearly");
    test(200);

    setPeriodicList(miscPeriodic, [500], "monthly");
    test(500);

    setPeriodicList(miscPeriodic, [1200], "yearly");
    test(100);
  });

  it("should calculate misc onetime costs", () => {
    const miscOnetime = mgmt.onlyChild("miscOnetimeCost");
    const test = (val: number) => {
      expect(miscOnetime.numValue("valueDollars")).toBe(val);
    };

    setOnetimeList(miscOnetime, [500]);
    test(500);

    setOnetimeEditor(miscOnetime, 1200);
    test(1200);
  });
  it("should calculate periodic costs", () => {
    add1000Rent();
    const test = (val: number) => {
      expect(mgmt.numValue("expensesMonthly")).toBe(val);
      expect(mgmt.numValue("expensesYearly")).toBe(val * 12);
    };

    const basePay = mgmt.onlyChild("mgmtBasePayValue");
    basePay.updateValues({ valueSourceName: "tenPercentRent" });

    const vacancyLoss = mgmt.onlyChild("vacancyLossValue");
    vacancyLoss.updateValues({ valueSourceName: "fivePercentRent" });

    const miscOngoing = mgmt.onlyChild("miscOngoingCost");
    miscOngoing.updateValues({ valueSourceName: "valueDollarsEditor" });
    const editor = miscOngoing.onlyChild("valueDollarsEditor");
    editor.updateValues({
      valueEditorFrequency: "monthly",
      valueEditor: numObj(200),
    });

    test(100 + 50 + 200);
  });
});
