import { GroupKey, groupVarbName } from "../GroupName";
import {
  UpdateSectionVarbs,
  usvs,
} from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { uosbS } from "../updateSectionVarbs/updateVarb/OverrideBasics";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { uvsS } from "../updateSectionVarbs/updateVarbs";

export function taxesAndHomeInsValueUpdateVarbs(): UpdateSectionVarbs<"taxesValue"> {
  return usvs("taxesValue", {
    valueSourceName: updateVarb("taxesAndHomeInsSource", {
      initValue: "sameAsHoldingPhase",
    }),
    ...uvsS.periodic2("valueDollars", {
      monthly: valueDollarsBasics("monthly"),
      yearly: valueDollarsBasics("yearly"),
    }),
  });
}

function valueDollarsBasics(groupKey: GroupKey<"periodic">) {
  const valueName = groupVarbName("value", "periodic", groupKey);
  return uosbS.valueSource("taxesAndHomeInsSource", {
    valueDollarsEditor: ubS.loadChild("valueDollarsEditor", valueName),
    sameAsHoldingPhase: ubS.loadChild("valueDollarsEditor", valueName),
  });
}
