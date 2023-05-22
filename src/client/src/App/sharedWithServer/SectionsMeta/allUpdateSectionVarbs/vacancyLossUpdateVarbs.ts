import { updateGroupS } from "../updateSectionVarbs/switchUpdateVarbs";
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

export function vacancyLossUpdateVarbs(): UpdateSectionVarbs<"vacancyLossValue"> {
  return {
    ...updateVarbsS._typeUniformity,
    valueSourceName: updateVarb("vacancyLossValueSource", {
      initValue: "none",
    }),
    valuePercentEditor: updateVarb("numObj"),
    valuePercent: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverrideS.emptyNumObjIfSourceIsNone,
        updateOverride(
          [overrideSwitchS.valueSourceIs("percentOfRentEditor")],
          updateBasicsS.loadSolvableTextByVarbInfo("valuePercentEditor")
        ),
        updateOverride(
          [overrideSwitchS.valueSourceIs("fivePercentRent")],
          updateBasicsS.equationSimple(
            "decimalToPercent",
            updateFnPropS.local("valueDecimal")
          )
        ),
        updateOverride(
          [overrideSwitchS.valueSourceIs("tenPercentRent")],
          updateBasicsS.equationSimple(
            "decimalToPercent",
            updateFnPropS.local("valueDecimal")
          )
        ),
        updateOverride(
          [overrideSwitchS.valueSourceIs("dollarsEditor")],
          updateBasicsS.equationSimple(
            "decimalToPercent",
            updateFnPropS.local("valueDecimal")
          )
        ),
      ],
    }),
    valueDecimal: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverrideS.emptyNumObjIfSourceIsNone,
        updateOverride(
          [overrideSwitchS.valueSourceIs("percentOfRentEditor")],
          updateBasicsS.equationSimple(
            "percentToDecimal",
            updateFnPropS.local("valuePercentEditor")
          )
        ),
        updateOverride(
          [overrideSwitchS.valueSourceIs("fivePercentRent")],
          updateBasicsS.pointZeroFive
        ),
        updateOverride(
          [overrideSwitchS.valueSourceIs("tenPercentRent")],
          updateBasicsS.pointOne
        ),
        updateOverride(
          [
            overrideSwitchS.valueSourceIs("dollarsEditor"),
            overrideSwitchS.periodic("valueDollars", "monthly"),
          ],
          updateBasicsS.equationLR(
            "divide",
            updateFnPropS.local("valueDollarsPeriodicEditor"),
            updateFnPropS.pathNameBase("propertyFocal", "targetRentMonthly")
          )
        ),
        updateOverride(
          [
            overrideSwitchS.valueSourceIs("dollarsEditor"),
            overrideSwitchS.periodic("valueDollars", "yearly"),
          ],
          updateBasicsS.equationLR(
            "divide",
            updateFnPropS.local("valueDollarsPeriodicEditor"),
            updateFnPropS.pathNameBase("propertyFocal", "targetRentYearly")
          )
        ),
      ],
    }),
    ...updateGroupS.group("valueDollars", "periodicInput", "monthly", {
      switch: { initValue: "monthly" },
      monthly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverrideS.emptyNumObjIfSourceIsNone,
          updateOverride(
            [overrideSwitchS.valueSourceIs("fivePercentRent")],
            updateBasicsS.loadByVarbPathName("fivePercentRentMonthly")
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("tenPercentRent")],
            updateBasicsS.loadByVarbPathName("tenPercentRentMonthly")
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("percentOfRentEditor")],
            updateBasicsS.equationLR(
              "multiply",
              updateFnPropS.local("valueDecimal"),
              updateFnPropS.pathNameBase("propertyFocal", "targetRentMonthly")
            )
          ),
          updateOverride(
            [
              overrideSwitchS.valueSourceIs("dollarsEditor"),
              overrideSwitchS.monthlyIsActive("valueDollars"),
            ],
            updateBasicsS.loadFromLocal("valueDollarsPeriodicEditor")
          ),
          updateOverride(
            [
              overrideSwitchS.valueSourceIs("dollarsEditor"),
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
          updateOverride(
            [overrideSwitchS.valueSourceIs("fivePercentRent")],
            updateBasicsS.loadByVarbPathName("fivePercentRentYearly")
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("tenPercentRent")],
            updateBasicsS.loadByVarbPathName("tenPercentRentYearly")
          ),
          updateOverride(
            [overrideSwitchS.valueSourceIs("percentOfRentEditor")],
            updateBasicsS.equationLR(
              "multiply",
              updateFnPropS.local("valueDecimal"),
              updateFnPropS.pathNameBase("propertyFocal", "targetRentYearly")
            )
          ),
          updateOverride(
            [
              overrideSwitchS.valueSourceIs("dollarsEditor"),
              overrideSwitchS.monthlyIsActive("valueDollars"),
            ],
            updateBasicsS.monthlyToYearly("valueDollars")
          ),
          updateOverride(
            [
              overrideSwitchS.valueSourceIs("dollarsEditor"),
              overrideSwitchS.yearlyIsActive("valueDollars"),
            ],
            updateBasicsS.loadFromLocal("valueDollarsPeriodicEditor")
          ),
        ],
      },
    }),
  };
}
