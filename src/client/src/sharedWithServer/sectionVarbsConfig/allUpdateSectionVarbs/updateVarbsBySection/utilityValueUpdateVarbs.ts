import { VarbPathName } from "../../../SectionInfos/VarbPathNameInfo";
import { GroupKey, groupNameEnding, GroupRecord } from "../../GroupName";

import { usvs, USVS } from "../updateSectionVarbs";
import { uvS } from "../updateVarb";
import { uosbS } from "../updateVarb/OverrideBasics";
import { ubS } from "../updateVarb/UpdateBasics";
import { uvsS } from "../updateVarbs";

export function utilityValueUpdateVarbs(): USVS<"utilityValue"> {
  return usvs("utilityValue", {
    valueSourceName: uvS.input("utilityValueSource", { initValue: "none" }),
    ...uvsS.periodic2("valueDollars", {
      monthly: valueDollars("monthly"),
      yearly: valueDollars("yearly"),
    }),
  });
}

function valueDollars(groupKey: GroupKey<"periodic">) {
  const ending = groupNameEnding("periodic", groupKey);
  const threeHundredFn: GroupRecord<"periodic", VarbPathName> = {
    monthly: "threeHundredPerUnit",
    yearly: "threeHundredPerUnitTimesTwelve",
  };
  return uosbS.valueSource("utilityValueSource", {
    none: ubS.emptyNumObj,
    zero: ubS.emptyNumObj,
    sameAsHoldingPhase: ubS.varbPathName(`utilitiesHolding${ending}`),
    threeHundredPerUnit: ubS.varbPathName(threeHundredFn[groupKey]),
    valueDollarsEditor: ubS.loadChild("valueDollarsEditor", `value${ending}`),
    listTotal: ubS.loadChild("periodicList", `total${ending}`),
  });
}
