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

export function downPaymentUpdateVarbs(): UpdateSectionVarbs<"downPaymentValue"> {
  return {
    ...updateVarbsS._typeUniformity,
    valueSourceName: updateVarb("downPaymentValueSource", {
      initValue: "none",
    }),
    valuePercentEditor: updateVarb("numObj"),
    valueDollarsEditor: updateVarb("numObj"),
    valueDollars: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverrideS.emptyNumObjIfSourceIsNone,
        updateOverride(
          [overrideSwitchS.valueSourceIs("dollarsEditor")],
          updateBasicsS.loadFromLocal("valueDollarsEditor")
        ),
        ...(["percentOfAssetEditor", "fifteenPercentAsset"] as const).map(
          (valueSource) =>
            updateOverride(
              [overrideSwitchS.valueSourceIs(valueSource)],
              updateBasicsS.equationLeftRight(
                "simpleMultiply",
                updateFnPropS.local("valueDecimal"),
                updateFnPropS.pathName("loanFocal", "loanPurchasedAssetValue")
              )
            )
        ),
      ],
    }),
    valuePercent: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverrideS.emptyNumObjIfSourceIsNone,
        updateOverride(
          [overrideSwitchS.valueSourceIs("percentOfAssetEditor")],
          updateBasicsS.loadSolvableTextByVarbInfo("valuePercentEditor")
        ),
        ...(["fifteenPercentAsset", "dollarsEditor"] as const).map(
          (valueSource) =>
            updateOverride(
              [overrideSwitchS.valueSourceIs(valueSource)],
              updateBasicsS.equationSimple(
                "decimalToPercent",
                updateFnPropS.local("valueDecimal")
              )
            )
        ),
      ],
    }),
    valueDecimal: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverrideS.emptyNumObjIfSourceIsNone,
        updateOverride(
          [overrideSwitchS.valueSourceIs("percentOfAssetEditor")],
          updateBasicsS.equationSimple(
            "percentToDecimal",
            updateFnPropS.local("valuePercentEditor")
          )
        ),
        updateOverride(
          [overrideSwitchS.valueSourceIs("fifteenPercentAsset")],
          updateBasicsS.pointOneFive
        ),
        updateOverride(
          [overrideSwitchS.valueSourceIs("dollarsEditor")],
          updateBasicsS.equationLeftRight(
            "simpleDivide",
            updateFnPropS.local("valueDollarsEditor"),
            updateFnPropS.pathNameBase("loanFocal", "loanPurchasedAssetValue")
          )
        ),
      ],
    }),
  };
}
