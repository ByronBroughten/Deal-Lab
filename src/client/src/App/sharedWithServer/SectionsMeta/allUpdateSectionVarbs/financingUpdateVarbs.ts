import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { financingCompletionStatus } from "./calculatedUpdateVarbs/completionStatusVarbs";

export function financingUpdateVarbs(): UpdateSectionVarbs<"financing"> {
  return {
    ...updateVarbsS._typeUniformity,
    one: updateVarbS.one(),
    completionStatus: financingCompletionStatus,
    financingMode: updateVarb("financingMode"),
    financingMethod: updateVarb("financingMethod", { initValue: "" }),
    displayName: updateVarb("stringObj", {
      updateFnName: "financingDisplayName",
      updateFnProps: {
        loanNames: [updateFnPropS.children("loan", "displayName")],
      },
    }),
  };
}
