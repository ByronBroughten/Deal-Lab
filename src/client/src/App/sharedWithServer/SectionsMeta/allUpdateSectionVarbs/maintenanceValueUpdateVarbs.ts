import { usvs, USVS } from "../updateSectionVarbs/updateSectionVarbs";
import { uvS } from "../updateSectionVarbs/updateVarb";
import { uosbS } from "../updateSectionVarbs/updateVarb/OverrideBasics";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { uvsS } from "../updateSectionVarbs/updateVarbs";

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
        onePercentArv: ubS.loadByVarbPathName("onePercentArv"),
        sqft: ubS.loadByVarbPathName("sqft"),
        onePercentArvAndSqft: ubS.loadByVarbPathName(
          "onePercentArvSqftAverage"
        ),
      }),
    }),
  });
}
