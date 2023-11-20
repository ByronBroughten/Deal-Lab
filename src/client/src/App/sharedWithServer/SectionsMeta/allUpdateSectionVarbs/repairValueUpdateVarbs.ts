import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import {
  updateBasics,
  updateBasicsS,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateOverride } from "../updateSectionVarbs/updateVarb/UpdateOverride";
import { overrideSwitchS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { UnionValue } from "../values/StateValue/unionValues";

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
          updateBasicsS.loadFromChild("onetimeList", "total")
        ),
      ],
    }),
  };
}
