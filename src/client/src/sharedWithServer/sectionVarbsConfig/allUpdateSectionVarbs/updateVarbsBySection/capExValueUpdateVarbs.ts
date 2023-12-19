import { GroupKey, groupNameEnding } from "../../GroupName";
import { USVS, usvs } from "../updateSectionVarbs";
import { uvS } from "../updateVarb";
import { uosbS } from "../updateVarb/OverrideBasics";
import { ubS } from "../updateVarb/UpdateBasics";
import { uvsS } from "../updateVarbs";

export function capExValueUpdateVarbs(): USVS<"capExValue"> {
  return usvs("capExValue", {
    valueSourceName: uvS.input("capExValueSource"),
    ...uvsS.periodic2("valueDollars", {
      monthly: valueDollars("monthly"),
      yearly: valueDollars("yearly"),
    }),
  });
}

function valueDollars(groupKey: GroupKey<"periodic">) {
  const ending = groupNameEnding("periodic", groupKey);
  return uosbS.valueSource("capExValueSource", {
    none: ubS.emptyNumObj,
    fivePercentRent: ubS.varbPathName(`fivePercentRent${ending}`),
    listTotal: ubS.loadChild("capExList", `total${ending}`),
    valueDollarsEditor: ubS.loadChild("valueDollarsEditor", `value${ending}`),
  });
}
