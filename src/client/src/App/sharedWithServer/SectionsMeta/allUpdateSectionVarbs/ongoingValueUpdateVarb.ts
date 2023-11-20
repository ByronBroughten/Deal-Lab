import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import {
  updateBasics,
  updateBasicsS,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateOverride } from "../updateSectionVarbs/updateVarb/UpdateOverride";
import { uosS } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { overrideSwitchS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

const varbsS = updateVarbsS;
export function taxesAndHomeInsValueUpdateVarbs(): UpdateSectionVarbs<"taxesValue"> {
  return {
    ...varbsS._typeUniformity,
    valueSourceName: updateVarb("taxesAndHomeInsSource", {
      initValue: "sameAsHoldingPhase",
    }),
    valueDollarsPeriodicEditor: updateVarb("numObj"),
    ...varbsS.group("valueDollars", "periodic", "monthly", {
      targets: { updateFnName: "throwIfReached" },
      monthly: {
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.yearlyIsActive("valueDollars")],
            updateBasicsS.yearlyToMonthly("valueDollars")
          ),
          ...uosS.valueSource("taxesAndHomeInsSource", {
            // property accesses the varbSwitchName and accesses holdingPhase
            sameAsHoldingPhase: updateBasics("emptyNumObj"),
            valueDollarsPeriodicEditor: updateBasicsS.loadLocal(
              "valueDollarsPeriodicEditor"
            ),
          }),
        ],
      },
      yearly: {
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.monthlyIsActive("valueDollars")],
            updateBasicsS.monthlyToYearly("valueDollars")
          ),
          ...uosS.valueSource("taxesAndHomeInsSource", {
            sameAsHoldingPhase: updateBasics("emptyNumObj"),
            valueDollarsPeriodicEditor: updateBasicsS.loadLocal(
              "valueDollarsPeriodicEditor"
            ),
          }),
        ],
      },
    }),
  };
}
