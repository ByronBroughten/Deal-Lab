import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateOverride } from "../updateSectionVarbs/updateVarb/UpdateOverride";
import { overrideSwitchS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { numObj } from "../values/StateValue/NumObj";

const switchS = overrideSwitchS;
const basicsS = updateBasicsS;

export function miscPeriodicCostUpdateVarbs(): UpdateSectionVarbs<"miscPeriodicValue"> {
  return {
    valueSourceName: updateVarb("dollarsOrListOngoing", {
      initValue: "valueDollarsPeriodicEditor",
    }),
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.group("valueDollars", "periodicInput", "monthly", {
      editor: { initValue: numObj(0) },
      monthly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [switchS.valueSourceIs("listTotal")],
            basicsS.loadFromChild("periodicList", "totalMonthly")
          ),
          updateOverride(
            [switchS.local("valueDollarsPeriodicSwitch", "monthly")],
            basicsS.loadLocal("valueDollarsPeriodicEditor")
          ),
          updateOverride(
            [switchS.local("valueDollarsPeriodicSwitch", "yearly")],
            basicsS.yearlyToMonthly("valueDollars")
          ),
        ],
      },
      yearly: {
        updateOverrides: [
          updateOverride(
            [switchS.valueSourceIs("listTotal")],
            basicsS.loadFromChild("periodicList", "totalYearly")
          ),
          updateOverride(
            [switchS.local("valueDollarsPeriodicSwitch", "yearly")],
            basicsS.loadLocal("valueDollarsPeriodicEditor")
          ),
          updateOverride(
            [switchS.local("valueDollarsPeriodicSwitch", "monthly")],
            basicsS.monthlyToYearly("valueDollars")
          ),
        ],
      },
    }),
  };
}
