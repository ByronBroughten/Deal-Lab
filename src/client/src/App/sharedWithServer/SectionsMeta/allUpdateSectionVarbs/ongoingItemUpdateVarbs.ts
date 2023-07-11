import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
  updateOverrideS,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
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
            updateBasicsS.loadFromLocal("valueDollarsPeriodicEditor")
          ),
          updateOverrideS.activeYearlyToMonthly(valueNameBase),
        ],
      }),
      yearly: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.yearlyIsActive(valueNameBase)],
            updateBasicsS.loadFromLocal("valueDollarsPeriodicEditor")
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
        updateFnPropS.local("costToReplace"),
        updateFnPropS.local("lifespanYears")
      ),
      monthly: updateBasicsS.equationLR(
        "divide",
        updateFnPropS.local("costToReplace"),
        updateFnPropS.local("lifespanMonths")
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
            updateBasicsS.loadFromLocal("lifespanSpanEditor")
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
            updateBasicsS.loadFromLocal("lifespanSpanEditor")
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
