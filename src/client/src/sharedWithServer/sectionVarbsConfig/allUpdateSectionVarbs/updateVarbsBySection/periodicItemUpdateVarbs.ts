import { UpdateSectionVarbs, usvs } from "../updateSectionVarbs";
import { updateVarb } from "../updateVarb";
import { uvsS } from "../updateVarbs";

export function periodicItemUpdateVarbs(): UpdateSectionVarbs<"periodicItem"> {
  return usvs("periodicItem", {
    ...uvsS.displayNameAndEditor,
    valueSourceName: updateVarb("valueDollarsEditor"),
    ...uvsS.loadChildPeriodic("valueDollars", "valueDollarsEditor", "value"),
  });
}
