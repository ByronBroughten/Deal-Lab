import { UnionValue } from "../../schema4ValueTraits/StateValue/unionValues";
import { UpdateSectionVarbs } from "../updateSectionVarbs";
import { updateVarb } from "../updateVarb";
import { updateBasics, updateBasicsS } from "../updateVarb/UpdateBasics";
import { updateOverride } from "../updateVarb/UpdateOverride";
import { overrideSwitchS } from "../updateVarb/UpdateOverrideSwitch";
import { updateVarbsS } from "../updateVarbs";

const switchS = overrideSwitchS;

export function repairValueUpdateVarbs(
  initValueSource: UnionValue<"repairValueSource">
): UpdateSectionVarbs<"repairValue"> {
  return {
    ...updateVarbsS._typeUniformity,
    valueSourceName: updateVarb("repairValueSource", {
      initValue: initValueSource,
    }),
    valueDollarsEditor: updateVarb("numObj"),
    valueDollars: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [switchS.local("valueSourceName", "none")],
          updateBasics("emptyNumObj")
        ),
        updateOverride(
          [switchS.local("valueSourceName", "zero")],
          updateBasicsS.zero
        ),
        updateOverride(
          [switchS.local("valueSourceName", "valueDollarsEditor")],
          updateBasicsS.loadLocal("valueDollarsEditor")
        ),
        updateOverride(
          [switchS.local("valueSourceName", "listTotal")],
          updateBasicsS.loadChild("onetimeList", "total")
        ),
      ],
    }),
  };
}
