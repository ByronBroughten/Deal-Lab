import {
  UpdateSectionVarbs,
  usvs,
} from "../updateSectionVarbs/updateSectionVarbs";
import { uvS } from "../updateSectionVarbs/updateVarb";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { uvsS } from "../updateSectionVarbs/updateVarbs";

export function capExItemUpdateVarbs(): UpdateSectionVarbs<"capExItem"> {
  return usvs("capExItem", {
    ...uvsS.displayNameAndEditor,
    ...uvsS.periodic2("valueDollars", {
      monthly: ubS.divide("costToReplace", "lifespanMonths"),
      yearly: ubS.divide("costToReplace", "lifespanYears"),
    }),
    costToReplace: uvS.input("numObj"),
    ...uvsS.loadChildTimespan("lifespan", "lifespanEditor", "value"),
  });
}
