import { UpdateSectionVarbs, usvs } from "../updateSectionVarbs";
import { uvS } from "../updateVarb";
import { ubS } from "../updateVarb/UpdateBasics";
import { uvsS } from "../updateVarbs";

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
