import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { uvS } from "../updateSectionVarbs/updateVarb";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { uvsS } from "../updateSectionVarbs/updateVarbs";
import { UnionValue } from "../values/StateValue/unionValues";

export function timespanEditorUpdateVarbs(
  initValue?: UnionValue<"timespan">
): UpdateSectionVarbs<"timespanEditor"> {
  return {
    ...uvsS._typeUniformity,
    valueSourceName: uvS.input("timespan", {
      initValue: initValue ?? "months",
    }),
    valueEditor: uvS.input("numObj"),
    valueMonths: uvS.vsNumObj("timespan", {
      months: ubS.loadLocal("valueEditor"),
      years: ubS.yearsToMonths("value"),
    }),
    valueYears: uvS.vsNumObj("timespan", {
      years: ubS.loadLocal("valueEditor"),
      months: ubS.monthsToYears("value"),
    }),
  };
}
