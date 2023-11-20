import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { uvS } from "../updateSectionVarbs/updateVarb";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { upS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { uvsS } from "./../updateSectionVarbs/updateVarbs";

type Base = "taxes" | "homeIns";
export function standardPrepaidUpdateVarbs(
  base: Base
): UpdateSectionVarbs<"prepaidTaxes"> {
  return {
    ...uvsS._typeUniformity,
    valueSourceName: uvS.input("spanOrDollars", {
      initValue: "valueSpanEditor",
    }),
    valueDollarsEditor: uvS.input("numObj"),
    valueSpanEditor: uvS.input("numObj"),
    valueSpanSwitch: uvS.input("timespan", { initValue: "months" }),
    valueMonths: uvS.vsNumObj("timespan", {
      months: ubS.loadLocal("valueSpanEditor"),
      years: ubS.yearsToMonths("value"),
    }),
    valueYears: uvS.vsNumObj("timespan", {
      years: ubS.loadLocal("valueSpanEditor"),
      months: ubS.monthsToYears("value"),
    }),
    valueDollars: uvS.vsNumObj("spanOrDollars", {
      valueDollarsEditor: ubS.loadLocal("valueDollarsEditor"),
      valueSpanEditor: ubS.multiply(
        upS.varbPathName(`${base}OngoingMonthly`),
        "valueMonths"
      ),
      // except... if the loan is purchase and for brrrr or property, you'll want holding..., no?
      // I don't think it'll matter.
      // I don't think prepaids will ever really be a factor in that case.
    }),
  };
}

export function prepaidInterestUpdateVarbs(): UpdateSectionVarbs<"prepaidInterest"> {
  return {
    ...uvsS._typeUniformity,
    valueSourceName: uvS.input("spanOrDollars", {
      initValue: "valueSpanEditor",
    }),
    valueDollarsEditor: uvS.input("numObj"),
    valueSpanEditor: uvS.input("numObj"),
    valueSpanSwitch: uvS.input("days"),
  };
}
