import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  overrideSwitchS,
  updateOverride,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { numObj } from "../values/StateValue/NumObj";

const switchS = overrideSwitchS;
const basicsS = updateBasicsS;

export function miscPeriodicCostUpdateVarbs(): UpdateSectionVarbs<"miscPeriodicCost"> {
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
            basicsS.loadFromLocal("valueDollarsPeriodicEditor")
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
            basicsS.loadFromLocal("valueDollarsPeriodicEditor")
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
