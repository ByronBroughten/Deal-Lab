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
    valueDollarsOngoingEditor: updateVarb("numObj"),
    ...varbsS.group("valueDollars", "ongoing", "monthly", {
      targets: { updateFnName: "throwIfReached" },
      monthly: {
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.yearlyIsActive("valueDollars")],
            updateBasicsS.yearlyToMonthly("valueDollars")
          ),
          ...valueSourceOverrides("ongoingPhaseSource", {
            sameAsHoldingPhase: updateBasicsS.loadByVarbPathName(monthlyVpn),
            valueDollarsEditor: updateBasicsS.loadFromLocal(
              "valueDollarsOngoingEditor"
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
            valueDollarsEditor: updateBasicsS.loadFromLocal(
              "valueDollarsOngoingEditor"
            ),
          }),
        ],
      },
    }),
  };
}
