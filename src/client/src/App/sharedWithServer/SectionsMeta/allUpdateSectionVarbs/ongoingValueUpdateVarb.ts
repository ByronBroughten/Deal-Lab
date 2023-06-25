import { validateVarbPathName } from "../SectionInfo/VarbPathNameInfo";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  overrideSwitchS,
  updateOverride,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { valueSourceOverrides } from "../updateSectionVarbs/updateVarb/updateVarbUtils";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

const varbsS = updateVarbsS;
export function ongoingValueUpdateVarb(
  varbPathNameBase: "taxesHolding" | "homeInsHolding"
): UpdateSectionVarbs<"taxesOngoing"> {
  const monthlyVpn = validateVarbPathName(`${varbPathNameBase}Monthly`);
  const yearlyVpn = validateVarbPathName(`${varbPathNameBase}Yearly`);

  return {
    ...varbsS._typeUniformity,
    valueSourceName: updateVarb("ongoingPhaseSource", {
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
          ...valueSourceOverrides("ongoingPhaseSource", {
            sameAsHoldingPhase: updateBasicsS.loadByVarbPathName(monthlyVpn),
            valueDollarsPeriodicEditor: updateBasicsS.loadFromLocal(
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
          ...valueSourceOverrides("ongoingPhaseSource", {
            sameAsHoldingPhase: updateBasicsS.loadByVarbPathName(yearlyVpn),
            valueDollarsPeriodicEditor: updateBasicsS.loadFromLocal(
              "valueDollarsPeriodicEditor"
            ),
          }),
        ],
      },
    }),
  };
}

export function holdingValueUpdateVarb(): UpdateSectionVarbs<"taxesHolding"> {
  return {
    ...varbsS._typeUniformity,
    valueSourceName: updateVarb("valueDollarsPeriodicEditor"),
    valueDollarsPeriodicEditor: updateVarb("numObj"),
    ...varbsS.group("valueDollars", "periodic", "monthly", {
      targets: { updateFnName: "throwIfReached" },
      monthly: {
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.yearlyIsActive("valueDollars")],
            updateBasicsS.yearlyToMonthly("valueDollars")
          ),
          updateOverride(
            [overrideSwitchS.monthlyIsActive("valueDollars")],
            updateBasicsS.loadFromLocal("valueDollarsPeriodicEditor")
          ),
        ],
      },
      yearly: {
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.monthlyIsActive("valueDollars")],
            updateBasicsS.monthlyToYearly("valueDollars")
          ),
          updateOverride(
            [overrideSwitchS.yearlyIsActive("valueDollars")],
            updateBasicsS.loadFromLocal("valueDollarsPeriodicEditor")
          ),
        ],
      },
    }),
  };
}
