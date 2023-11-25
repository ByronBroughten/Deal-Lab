import {
  UpdateSectionVarbs,
  usvs,
} from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { uosbS } from "../updateSectionVarbs/updateVarb/OverrideBasics";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { uvsS } from "../updateSectionVarbs/updateVarbs";

export function miscPeriodicCostUpdateVarbs(): UpdateSectionVarbs<"miscPeriodicValue"> {
  return usvs("miscPeriodicValue", {
    valueSourceName: updateVarb("dollarsOrListOngoing", {
      initValue: "valueDollarsEditor",
    }),
    ...uvsS.periodic2("valueDollars", {
      monthly: uosbS.valueSource("dollarsOrListOngoing", {
        listTotal: ubS.loadChild("periodicList", "totalMonthly"),
        valueDollarsEditor: ubS.loadChild("periodicEditor", "valueMonthly"),
      }),
      yearly: uosbS.valueSource("dollarsOrListOngoing", {
        listTotal: ubS.loadChild("periodicList", "totalYearly"),
        valueDollarsEditor: ubS.loadChild("periodicEditor", "valueYearly"),
      }),
    }),
  });
}
