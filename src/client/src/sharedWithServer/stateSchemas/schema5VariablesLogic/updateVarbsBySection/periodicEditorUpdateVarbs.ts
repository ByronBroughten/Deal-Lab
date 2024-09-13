import { UnionValue } from "../../schema4ValueTraits/StateValue/unionValues";
import { UpdateSectionVarbs } from "../updateSectionVarbs";
import { uvS } from "../updateVarb";
import { ubS } from "../updateVarb/UpdateBasics";
import { uvsS } from "../updateVarbs";

export function periodicEditorUpdateVarbs(
  initValue?: UnionValue<"periodic">
): UpdateSectionVarbs<"periodicEditor"> {
  return {
    ...uvsS._typeUniformity,
    valueEditor: uvS.input("numObj"),
    valueEditorFrequency: uvS.input("periodic", {
      initValue: initValue ?? "monthly",
    }),
    valueMonthly: uvS.vsNumObj(
      "periodic",
      {
        monthly: ubS.loadLocal("valueEditor"),
        yearly: ubS.yearlyToMonthly2("value"),
      },
      { switchInfo: "valueEditorFrequency" }
    ),
    valueYearly: uvS.vsNumObj(
      "periodic",
      {
        yearly: ubS.loadLocal("valueEditor"),
        monthly: ubS.monthlyToYearly2("value"),
      },
      { switchInfo: "valueEditorFrequency" }
    ),
  };
}
