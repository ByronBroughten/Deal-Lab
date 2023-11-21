import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { upS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  updateOverride,
  updateOverrideS,
} from "../updateSectionVarbs/updateVarb/UpdateOverride";
import { overrideSwitchS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { uvsS } from "../updateSectionVarbs/updateVarbs";

const valueNameBase = "valueDollars";
export function ongoingItemUpdateVarbs(): UpdateSectionVarbs<"periodicItem"> {
  return {
    ...uvsS._typeUniformity,
    ...uvsS.displayNameAndEditor,
    valueSourceName: updateVarb("valueDollarsPeriodicEditor"),
    ...uvsS.group(valueNameBase, "periodicInput", "monthly", {
      monthly: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.monthlyIsActive(valueNameBase)],
            ubS.loadLocal("valueDollarsPeriodicEditor")
          ),
          updateOverrideS.activeYearlyToMonthly(valueNameBase),
        ],
      }),
      yearly: updateVarb("numObj", {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.yearlyIsActive(valueNameBase)],
            ubS.loadLocal("valueDollarsPeriodicEditor")
          ),
          updateOverrideS.activeMonthlyToYearly(valueNameBase),
        ],
      }),
    }),
  };
}

export function capExItemUpdateVarbs(): UpdateSectionVarbs<"capExItem"> {
  return {
    ...uvsS._typeUniformity,
    ...uvsS.displayNameAndEditor,
    ...uvsS.groupNext("valueDollars", "periodic", {
      yearly: ubS.divide(
        upS.local("costToReplace"),
        upS.local("lifespanYears")
      ),
      monthly: ubS.divide(
        upS.local("costToReplace"),
        upS.local("lifespanMonths")
      ),
    }),
    costToReplace: updateVarb("numObj"),
    ...uvsS.group("lifespan", "monthsYearsInput", "years", {
      targets: { updateFnName: "throwIfReached" },
      editor: { updateFnName: "calcVarbs" },
      months: {
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.monthsIsActive("lifespan")],
            ubS.loadLocal("lifespanSpanEditor")
          ),
          updateOverride(
            [overrideSwitchS.yearsIsActive("lifespan")],
            ubS.yearsToMonths("lifespan")
          ),
        ],
      },
      years: {
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.yearsIsActive("lifespan")],
            ubS.loadLocal("lifespanSpanEditor")
          ),
          updateOverride(
            [overrideSwitchS.monthsIsActive("lifespan")],
            ubS.monthsToYears("lifespan")
          ),
        ],
      },
    }),
  };
}
