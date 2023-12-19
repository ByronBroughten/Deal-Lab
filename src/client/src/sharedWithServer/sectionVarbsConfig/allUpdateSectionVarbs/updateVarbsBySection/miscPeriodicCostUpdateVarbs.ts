import { UpdateSectionVarbs, usvs } from "../updateSectionVarbs";
import { updateVarb } from "../updateVarb";
import { uosbS } from "../updateVarb/OverrideBasics";
import { ubS } from "../updateVarb/UpdateBasics";
import { uvsS } from "../updateVarbs";

export function miscPeriodicCostUpdateVarbs(): UpdateSectionVarbs<"miscPeriodicValue"> {
  return usvs("miscPeriodicValue", {
    valueSourceName: updateVarb("dollarsOrListOngoing", {
      initValue: "valueDollarsEditor",
    }),
    ...uvsS.periodic2("valueDollars", {
      monthly: uosbS.valueSource("dollarsOrListOngoing", {
        listTotal: ubS.loadChild("periodicList", "totalMonthly"),
        valueDollarsEditor: ubS.loadChild("valueDollarsEditor", "valueMonthly"),
      }),
      yearly: uosbS.valueSource("dollarsOrListOngoing", {
        listTotal: ubS.loadChild("periodicList", "totalYearly"),
        valueDollarsEditor: ubS.loadChild("valueDollarsEditor", "valueYearly"),
      }),
    }),
  });
}
