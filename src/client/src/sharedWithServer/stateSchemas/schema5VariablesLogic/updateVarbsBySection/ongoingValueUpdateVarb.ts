import {
  GroupKey,
  groupVarbName,
} from "../../schema3SectionStructures/GroupName";
import { UpdateSectionVarbs, usvs } from "../updateSectionVarbs";
import { updateVarb } from "../updateVarb";
import { uosbS } from "../updateVarb/OverrideBasics";
import { ubS } from "../updateVarb/UpdateBasics";
import { uvsS } from "../updateVarbs";

export function taxesAndHomeInsValueUpdateVarbs(): UpdateSectionVarbs<"taxesValue"> {
  return usvs("taxesValue", {
    valueSourceName: updateVarb("taxesAndHomeInsSource", {
      initValue: "valueDollarsEditor",
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
