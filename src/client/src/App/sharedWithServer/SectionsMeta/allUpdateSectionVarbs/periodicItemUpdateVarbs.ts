import {
  UpdateSectionVarbs,
  usvs,
} from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { uvsS } from "../updateSectionVarbs/updateVarbs";

export function periodicItemUpdateVarbs(): UpdateSectionVarbs<"periodicItem"> {
  return usvs("periodicItem", {
    ...uvsS.displayNameAndEditor,
    valueSourceName: updateVarb("valueDollarsEditor"),
    ...uvsS.loadChildPeriodic("valueDollars", "valueDollarsEditor", "value"),
  });
}
