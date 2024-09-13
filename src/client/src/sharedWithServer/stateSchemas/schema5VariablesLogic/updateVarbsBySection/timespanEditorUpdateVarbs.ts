import { UnionValue } from "../../schema4ValueTraits/StateValue/unionValues";
import { UpdateSectionVarbs } from "../updateSectionVarbs";
import { uvS } from "../updateVarb";
import { ubS } from "../updateVarb/UpdateBasics";
import { uvsS } from "../updateVarbs";

export function timespanEditorUpdateVarbs(
  initValue?: UnionValue<"timespan">
): UpdateSectionVarbs<"timespanEditor"> {
  return {
    ...uvsS._typeUniformity,
    valueEditor: uvS.input("numObj"),
    valueEditorUnit: uvS.input("timespan", {
      initValue: initValue ?? "months",
    }),
    valueMonths: uvS.vsNumObj(
      "timespan",
      {
        months: ubS.loadLocal("valueEditor"),
        years: ubS.yearsToMonths2("value"),
      },
      { switchInfo: "valueEditorUnit" }
    ),
    valueYears: uvS.vsNumObj(
      "timespan",
      {
        years: ubS.loadLocal("valueEditor"),
        months: ubS.monthsToYears2("value"),
      },
      { switchInfo: "valueEditorUnit" }
    ),
  };
}
