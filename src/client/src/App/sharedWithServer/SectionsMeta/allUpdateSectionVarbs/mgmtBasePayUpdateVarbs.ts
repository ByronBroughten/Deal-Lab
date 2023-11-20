import { updateGroupS } from "../updateSectionVarbs/switchUpdateVarbs";
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

export function mgmtBasePayValueVarbs(): UpdateSectionVarbs<"mgmtBasePayValue"> {
  return {
    ...updateVarbsS._typeUniformity,
    valueSourceName: updateVarb("mgmtBasePayValueSource", {
      initValue: "none",
    }),
    valuePercentEditor: updateVarb("numObj"),
    valuePercent: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverrideS.emptyNumObjIfSourceIsNone,
        updateOverrideS.zeroIfSourceIsZero,
        updateOverride(
          [overrideSwitchS.valueSourceIs("percentOfRentEditor")],
          updateBasicsS.loadSolvableTextByVarbInfo("valuePercentEditor")
        ),
        updateOverride(
          [overrideSwitchS.valueSourceIs("tenPercentRent")],
          updateBasicsS.equationSimple(
            "decimalToPercent",
            updatePropS.local("valueDecimal")
          )
        ),
        updateOverride(
          [overrideSwitchS.valueSourceIs("valueDollarsPeriodicEditor")],
          updateBasicsS.equationSimple(
            "decimalToPercent",
            updatePropS.local("valueDecimal")
          )
        ),
      ],
    }),
    valueDecimal: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverrideS.emptyNumObjIfSourceIsNone,
        updateOverrideS.zeroIfSourceIsZero,
        updateOverride(
          [overrideSwitchS.valueSourceIs("percentOfRentEditor")],
          updateBasicsS.equationSimple(
            "percentToDecimal",
            updatePropS.local("valuePercentEditor")
          )
        ),
        updateOverride(
          [overrideSwitchS.valueSourceIs("tenPercentRent")],
          updateBasicsS.pointOne
        ),
        updateOverride(
          [
            overrideSwitchS.valueSourceIs("valueDollarsPeriodicEditor"),
            overrideSwitchS.periodic("valueDollars", "monthly"),
          ],
          updateBasicsS.equationLR(
            "divide",
            updatePropS.local("valueDollarsPeriodicEditor"),
            updatePropS.pathNameBase("propertyFocal", "targetRentMonthly")
          )
        ),
        updateOverride(
          [
            overrideSwitchS.valueSourceIs("valueDollarsPeriodicEditor"),
            overrideSwitchS.periodic("valueDollars", "yearly"),
          ],
          updateBasicsS.equationLR(
            "divide",
            updatePropS.local("valueDollarsPeriodicEditor"),
            updatePropS.pathNameBase("propertyFocal", "targetRentYearly")
          )
        ),
      ],
    }),
    ...updateGroupS.group("valueDollars", "periodicInput", "monthly", {
      monthly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverrideS.emptyNumObjIfSourceIsNone,
          updateOverrideS.zeroIfSourceIsZero,
          updateOverride(
            [overrideSwitchS.valueSourceIs("tenPercentRent")],
            updateBasicsS.loadByVarbPathName("tenPercentRentMonthly")
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("percentOfRentEditor")],
            updateBasicsS.equationLR(
              "multiply",
              updatePropS.local("valueDecimal"),
              updatePropS.pathNameBase("propertyFocal", "targetRentMonthly")
            )
          ),
          updateOverride(
            [
              overrideSwitchS.valueSourceIs("valueDollarsPeriodicEditor"),
              overrideSwitchS.monthlyIsActive("valueDollars"),
            ],
            updateBasicsS.loadLocal("valueDollarsPeriodicEditor")
          ),
          updateOverride(
            [
              overrideSwitchS.valueSourceIs("valueDollarsPeriodicEditor"),
              overrideSwitchS.yearlyIsActive("valueDollars"),
            ],
            updateBasicsS.yearlyToMonthly("valueDollars")
          ),
        ],
      },
      yearly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverrideS.emptyNumObjIfSourceIsNone,
          updateOverrideS.zeroIfSourceIsZero,
          updateOverride(
            [overrideSwitchS.valueSourceIs("tenPercentRent")],
            updateBasicsS.loadByVarbPathName("tenPercentRentYearly")
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("percentOfRentEditor")],
            updateBasicsS.equationLR(
              "multiply",
              updatePropS.local("valueDecimal"),
              updatePropS.pathNameBase("propertyFocal", "targetRentYearly")
            )
          ),
          updateOverride(
            [
              overrideSwitchS.valueSourceIs("valueDollarsPeriodicEditor"),
              overrideSwitchS.monthlyIsActive("valueDollars"),
            ],
            updateBasicsS.monthlyToYearly("valueDollars")
          ),
          updateOverride(
            [
              overrideSwitchS.valueSourceIs("valueDollarsPeriodicEditor"),
              overrideSwitchS.yearlyIsActive("valueDollars"),
            ],
            updateBasicsS.loadLocal("valueDollarsPeriodicEditor")
          ),
        ],
      },
    }),
  };
}
