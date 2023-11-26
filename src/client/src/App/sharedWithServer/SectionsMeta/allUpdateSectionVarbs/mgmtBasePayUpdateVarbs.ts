import { GroupKey, groupNameEnding } from "../GroupName";
import { USVS, usvs } from "../updateSectionVarbs/updateSectionVarbs";
import { uvS } from "../updateSectionVarbs/updateVarb";
import {
  OverrideBasics,
  uosbS,
} from "../updateSectionVarbs/updateVarb/OverrideBasics";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { upS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { uvsS } from "../updateSectionVarbs/updateVarbs";

export function mgmtBasePayValueVarbs(): USVS<"mgmtBasePayValue"> {
  return usvs("mgmtBasePayValue", {
    valueSourceName: uvS.input("mgmtBasePayValueSource", {
      initValue: "none",
    }),
    valuePercentEditor: uvS.input("numObj"),
    valuePercent: uvS.vsNumObj("mgmtBasePayValueSource", {
      none: ubS.emptyNumObj,
      zero: ubS.zero,
      tenPercentRent: ubS.decimalToPercent("valueDecimal"),
      valuePercentEditor: ubS.loadLocal("valuePercentEditor"),
      valueDollarsEditor: ubS.decimalToPercent("valueDecimal"),
    }),
    valueDecimal: uvS.vsNumObj("mgmtBasePayValueSource", {
      none: ubS.emptyNumObj,
      zero: ubS.zero,
      tenPercentRent: ubS.pointOne,
      valuePercentEditor: ubS.percentToDecimal("valuePercentEditor"),
      valueDollarsEditor: ubS.divide(
        "valueDollarsMonthly",
        upS.varbPathName("targetRentMonthly")
      ),
    }),
    ...uvsS.periodic2("valueDollars", {
      monthly: valueDollars("monthly"),
      yearly: valueDollars("yearly"),
    }),
  });
}

function valueDollars(groupKey: GroupKey<"periodic">): OverrideBasics {
  const ending = groupNameEnding("periodic", groupKey);
  return uosbS.valueSource("mgmtBasePayValueSource", {
    none: ubS.emptyNumObj,
    zero: ubS.zero,
    tenPercentRent: ubS.varbPathName(`tenPercentRent${ending}`),
    valuePercentEditor: ubS.multiply(
      "valueDecimal",
      upS.varbPathName(`targetRent${ending}`)
    ),
    valueDollarsEditor: ubS.loadChild("valueDollarsEditor", `value${ending}`),
  });
}
