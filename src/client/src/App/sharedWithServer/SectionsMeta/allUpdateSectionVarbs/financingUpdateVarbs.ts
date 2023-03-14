import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

export function financingUpdateVarbs(): UpdateSectionVarbs<"financing"> {
  return {
    ...updateVarbsS._typeUniformity,
    one: updateVarbS.one(),
    financingMode: updateVarb("financingMode", { initValue: "" }),
  };
}
