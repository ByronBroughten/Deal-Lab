import { usvs, USVS } from "../updateSectionVarbs";
import { uvS } from "../updateVarb";
import { uosbS } from "../updateVarb/OverrideBasics";
import { ubS } from "../updateVarb/UpdateBasics";
import { uvsS } from "../updateVarbs";

export function maintenanceValueUpdateVarbs(): USVS<"maintenanceValue"> {
  return usvs("maintenanceValue", {
    valueSourceName: uvS.input("maintainanceValueSource", {
      initValue: "none",
    }),
    ...uvsS.periodic2("valueDollars", {
      monthly: uosbS.valueSource("maintainanceValueSource", {
        none: ubS.emptyNumObj,
        valueDollarsEditor: ubS.loadChild("valueDollarsEditor", "valueMonthly"),
        onePercentArv: ubS.yearlyToMonthly2("valueDollars"),
        sqft: ubS.yearlyToMonthly2("valueDollars"),
        onePercentArvAndSqft: ubS.yearlyToMonthly2("valueDollars"),
      }),
      yearly: uosbS.valueSource("maintainanceValueSource", {
        none: ubS.emptyNumObj,
        valueDollarsEditor: ubS.loadChild("valueDollarsEditor", "valueYearly"),
        onePercentArv: ubS.varbPathName("onePercentArv"),
        sqft: ubS.varbPathName("sqft"),
        onePercentArvAndSqft: ubS.varbPathName("onePercentArvSqftAverage"),
      }),
    }),
  });
}
