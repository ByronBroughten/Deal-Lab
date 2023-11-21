import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { uvS } from "../updateSectionVarbs/updateVarb";
import { uvsS } from "./../updateSectionVarbs/updateVarbs";

export function prepaidPeriodicUpdateVarbs(): UpdateSectionVarbs<"prepaidPeriodic"> {
  return {
    ...uvsS._typeUniformity,
    valueSourceName: uvS.input("spanOrDollars", {
      initValue: "valueSpanEditor",
    }),
    valueDollarsEditor: uvS.input("numObj"),
    valueMonths: uvS.loadNumObjChild("timespanEditor", "valueMonths"),
    valueYears: uvS.loadNumObjChild("timespanEditor", "valueYears"),
  };
}

export function prepaidDailyUpdateVarbs(): UpdateSectionVarbs<"prepaidDaily"> {
  return {
    ...uvsS._typeUniformity,
    valueSourceName: uvS.input("spanOrDollars", {
      initValue: "valueSpanEditor",
    }),
    valueDollarsEditor: uvS.input("numObj"),
    valueSpanEditor: uvS.input("numObj"),
  };
}
