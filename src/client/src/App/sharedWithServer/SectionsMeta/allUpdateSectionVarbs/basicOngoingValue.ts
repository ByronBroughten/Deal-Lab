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

const basicOngoingValueNames = [
  "miscHoldingCost",
  "miscOngoingCost",
  "miscRevenueValue",
] as const;
type BasicOngoingValueName = (typeof basicOngoingValueNames)[number];
export function basicOngoingValueVarbs(): UpdateSectionVarbs<BasicOngoingValueName> {
  return {
    valueSourceName: updateVarb("dollarsOrListOngoing", {
      initValue: "valueDollarsOngoingEditor",
    }),
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.group("valueDollars", "ongoingInput", "monthly", {
      editor: { initValue: numObj(0) },
      monthly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [switchS.valueSourceIs("listTotal")],
            basicsS.loadFromChild("ongoingList", "totalMonthly")
          ),
          updateOverride(
            [switchS.local("valueDollarsOngoingSwitch", "monthly")],
            basicsS.loadFromLocal("valueDollarsOngoingEditor")
          ),
          updateOverride(
            [switchS.local("valueDollarsOngoingSwitch", "yearly")],
            basicsS.yearlyToMonthly("valueDollars")
          ),
        ],
      },
      yearly: {
        updateOverrides: [
          updateOverride(
            [switchS.valueSourceIs("listTotal")],
            basicsS.loadFromChild("ongoingList", "totalYearly")
          ),
          updateOverride(
            [switchS.local("valueDollarsOngoingSwitch", "yearly")],
            basicsS.loadFromLocal("valueDollarsOngoingEditor")
          ),
          updateOverride(
            [switchS.local("valueDollarsOngoingSwitch", "monthly")],
            basicsS.monthlyToYearly("valueDollars")
          ),
        ],
      },
    }),
  };
}
