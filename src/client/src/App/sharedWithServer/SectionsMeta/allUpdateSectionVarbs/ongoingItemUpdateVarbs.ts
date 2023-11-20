import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updatePropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  updateOverride,
  updateOverrideS,
} from "../updateSectionVarbs/updateVarb/UpdateOverride";
import { overrideSwitchS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

const valueNameBase = "valueDollars";
export function ongoingItemUpdateVarbs(): UpdateSectionVarbs<"periodicItem"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.displayNameAndEditor,
    valueSourceName: updateVarb("valueDollarsPeriodicEditor"),
    ...updateVarbsS.group(valueNameBase, "periodicInput", "monthly", {
      monthly: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.monthlyIsActive(valueNameBase)],
            updateBasicsS.loadLocal("valueDollarsPeriodicEditor")
          ),
          updateOverrideS.activeYearlyToMonthly(valueNameBase),
        ],
      }),
      yearly: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.yearlyIsActive(valueNameBase)],
            updateBasicsS.loadLocal("valueDollarsPeriodicEditor")
          ),
          updateOverrideS.activeMonthlyToYearly(valueNameBase),
        ],
      }),
    }),
  };
}

export function capExItemUpdateVarbs(): UpdateSectionVarbs<"capExItem"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.displayNameAndEditor,
    ...updateVarbsS.group("valueDollars", "periodic", "monthly", {
      yearly: updateBasicsS.equationLR(
        "divide",
        updatePropS.local("costToReplace"),
        updatePropS.local("lifespanYears")
      ),
      monthly: updateBasicsS.equationLR(
        "divide",
        updatePropS.local("costToReplace"),
        updatePropS.local("lifespanMonths")
      ),
    }),
    costToReplace: updateVarb("numObj"),
    ...updateVarbsS.group("lifespan", "monthsYearsInput", "years", {
      targets: { updateFnName: "throwIfReached" },
      editor: { updateFnName: "calcVarbs" },
      months: {
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.monthsIsActive("lifespan")],
            updateBasicsS.loadLocal("lifespanSpanEditor")
          ),
          updateOverride(
            [overrideSwitchS.yearsIsActive("lifespan")],
            updateBasicsS.yearsToMonths("lifespan")
          ),
        ],
      },
      years: {
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.yearsIsActive("lifespan")],
            updateBasicsS.loadLocal("lifespanSpanEditor")
          ),
          updateOverride(
            [overrideSwitchS.monthsIsActive("lifespan")],
            updateBasicsS.monthsToYears("lifespan")
          ),
        ],
      },
    }),
  };
}
