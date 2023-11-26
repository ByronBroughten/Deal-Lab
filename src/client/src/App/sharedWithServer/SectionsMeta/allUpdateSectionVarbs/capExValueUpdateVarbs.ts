import { GroupKey, groupNameEnding } from "../GroupName";
import { USVS, usvs } from "../updateSectionVarbs/updateSectionVarbs";
import { uvS } from "../updateSectionVarbs/updateVarb";
import { uosbS } from "../updateSectionVarbs/updateVarb/OverrideBasics";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { uvsS } from "../updateSectionVarbs/updateVarbs";

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
