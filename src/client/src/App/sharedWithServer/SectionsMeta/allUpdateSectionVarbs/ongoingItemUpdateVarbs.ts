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

const valueNameBase = "value";
export function ongoingItemUpdateVarbs(): UpdateSectionVarbs<"ongoingItem"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.displayNameAndEditor,
    valueEditor: updateVarb("numObj"),
    valueSourceName: updateVarb("editorValueSource", {
      initValue: "valueEditor",
    }),
    ...updateVarbsS.group("value", "ongoing", "monthly", {
      targets: { updateFnName: "throwIfReached" },
      monthly: updateVarb("numObj", {
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.monthlyIsActive("value")],
            updateBasicsS.loadFromLocal("valueEditor")
          ),
          updateOverrideS.activeYearlyToMonthly(valueNameBase),
        ],
      }),
      yearly: updateVarb("numObj", {
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.yearlyIsActive("value")],
            updateBasicsS.loadFromLocal("valueEditor")
          ),
          updateOverrideS.activeMonthlyToYearly(valueNameBase),
        ],
      }),
    }),
  };
}

export function ongoingCheckmarkItemUpdateVarbs(): UpdateSectionVarbs<"ongoingCheckmarkItem"> {
  return {
    ...ongoingItemUpdateVarbs(),
    isActive: updateVarb("boolean"),
  };
}

export function capExItemUpdateVarbs(): UpdateSectionVarbs<"capExItem"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.displayNameAndEditor,
    ...updateVarbsS.group("value", "ongoing", "monthly", {
      yearly: updateBasicsS.equationLeftRight(
        "simpleDivide",
        updateFnPropS.local("costToReplace"),
        updateFnPropS.local("lifespanYears")
      ),
      monthly: updateBasicsS.equationLeftRight(
        "simpleDivide",
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
