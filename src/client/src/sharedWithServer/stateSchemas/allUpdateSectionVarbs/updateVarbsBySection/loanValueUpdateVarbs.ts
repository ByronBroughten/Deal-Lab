import { PathInVarbInfo } from "../../derivedFromChildrenSchemas/RelInOutVarbInfo";
import { unionValueArr } from "../../StateValue/unionValues";
import { UpdateSectionVarbs } from "../updateSectionVarbs";
import { UpdateVarb, updateVarb, uvS } from "../updateVarb";
import { ubS } from "../updateVarb/UpdateBasics";
import { updateFnProp, upS } from "../updateVarb/UpdateFnProps";
import { updateOverride } from "../updateVarb/UpdateOverride";
import { UpdateOverrides } from "../updateVarb/UpdateOverrides";
import { osS } from "../updateVarb/UpdateOverrideSwitch";
import { updateVarbsS } from "../updateVarbs";

export function loanValueUpdateVarbs(
  percentOfWhatInfo: PathInVarbInfo
): UpdateSectionVarbs<"purchaseLoanValue"> {
  const ofWhatProp = () => updateFnProp(percentOfWhatInfo);
  return {
    ...updateVarbsS._typeUniformity,
    completionStatus: loanValueCompletionStatus(),
    valueSourceName: updateVarb("percentDollarsSource", {
      initValue: "offPercentEditor",
    }),

    offPercentEditor: uvS.input("numObj"),
    offDollarsEditor: uvS.input("numObj"),
    amountPercentEditor: uvS.input("numObj"),
    amountDollarsEditor: uvS.input("numObj"),

    offDollars: uvS.vsNumObj("percentDollarsSource", {
      offDollarsEditor: ubS.loadLocal("offDollarsEditor"),
      amountDollarsEditor: ubS.subtract(ofWhatProp(), "amountDollars"),
      offPercentEditor: ubS.multiply(ofWhatProp(), "amountDollars"),
      amountPercentEditor: ubS.multiply(ofWhatProp(), "offDecimal"),
    }),
    amountDollars: uvS.vsNumObj("percentDollarsSource", {
      amountDollarsEditor: ubS.loadLocal("amountDollarsEditor"),
      offDollarsEditor: ubS.subtract(ofWhatProp(), "offDollars"),
      amountPercentEditor: ubS.multiply(ofWhatProp(), "amountDecimal"),
      offPercentEditor: ubS.multiply(ofWhatProp(), "amountDecimal"),
    }),
    amountPercent: uvS.vsNumObj("percentDollarsSource", {
      amountPercentEditor: ubS.loadLocal("amountPercentEditor"),
      offPercentEditor: ubS.equationSimple(
        "oneHundredMinus",
        "offPercentEditor"
      ),
      amountDollarsEditor: ubS.decimalToPercent("amountDecimal"),
      offDollarsEditor: ubS.decimalToPercent("amountDecimal"),
    }),
    offPercent: uvS.vsNumObj("percentDollarsSource", {
      offPercentEditor: ubS.loadLocal("offPercentEditor"),
      amountPercentEditor: ubS.equationSimple(
        "oneHundredMinus",
        "amountPercent"
      ),
      amountDollarsEditor: ubS.decimalToPercent("offDecimal"),
      offDollarsEditor: ubS.decimalToPercent("offDecimal"),
    }),
    amountDecimal: uvS.vsNumObj("percentDollarsSource", {
      amountDollarsEditor: ubS.divide("amountDollars", ofWhatProp()),
      offDollarsEditor: ubS.divide("amountDollars", ofWhatProp()),
      amountPercentEditor: ubS.percentToDecimal("amountPercent"),
      offPercentEditor: ubS.percentToDecimal("amountPercent"),
    }),
    offDecimal: uvS.vsNumObj("percentDollarsSource", {
      amountDollarsEditor: ubS.divide("offDollars", ofWhatProp()),
      offDollarsEditor: ubS.divide("offDollars", ofWhatProp()),
      amountPercentEditor: ubS.percentToDecimal("offPercent"),
      offPercentEditor: ubS.percentToDecimal("offPercent"),
    }),
  } as const;
}

function loanValueCompletionStatus(): UpdateVarb<"completionStatus"> {
  const sourceNames = unionValueArr("percentDollarsSource");
  const extraOverrides = sourceNames.reduce((overrides, sourceName) => {
    overrides.push(
      updateOverride(
        [osS.valueSourceIs(sourceName)],
        ubS.completionStatus({ validInputs: [upS.local(sourceName)] })
      )
    );
    return overrides;
  }, [] as UpdateOverrides);
  return uvS.completionStatusO(...extraOverrides);
}
