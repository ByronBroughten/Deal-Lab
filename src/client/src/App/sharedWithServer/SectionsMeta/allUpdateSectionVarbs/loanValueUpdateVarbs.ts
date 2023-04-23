import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  UpdateFnProp,
  updateFnPropS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { valueSourceOverrides } from "../updateSectionVarbs/updateVarb/UpdateOverrides";

export function loanValueUpdateVarbs(percentOfWhatProp: UpdateFnProp) {
  return {
    valueSourceName: updateVarb("percentDollarsSource", {
      initValue: "offPercent",
    }),

    offPercentEditor: updateVarb("numObj"),
    offDollarsEditor: updateVarb("numObj"),
    amountPercentEditor: updateVarb("numObj"),
    amountDollarsEditor: updateVarb("numObj"),

    offDollars: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: valueSourceOverrides("percentDollarsSource", {
        offDollars: updateBasicsS.loadFromLocal("offDollarsEditor"),
        amountDollars: updateBasicsS.equationLeftRight(
          "simpleSubtract",
          percentOfWhatProp,
          updateFnPropS.local("amountDollars")
        ),
        offPercent: updateBasicsS.equationLeftRight(
          "simpleMultiply",
          percentOfWhatProp,
          updateFnPropS.local("offDecimal")
        ),
        amountPercent: updateBasicsS.equationLeftRight(
          "simpleMultiply",
          percentOfWhatProp,
          updateFnPropS.local("offDecimal")
        ),
      }),
    }),
    amountDollars: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: valueSourceOverrides("percentDollarsSource", {
        amountDollars: updateBasicsS.loadFromLocal("amountDollarsEditor"),
        offDollars: updateBasicsS.equationLeftRight(
          "simpleSubtract",
          percentOfWhatProp,
          updateFnPropS.local("offDollars")
        ),
        amountPercent: updateBasicsS.equationLeftRight(
          "simpleMultiply",
          percentOfWhatProp,
          updateFnPropS.local("amountDecimal")
        ),
        offPercent: updateBasicsS.equationLeftRight(
          "simpleMultiply",
          percentOfWhatProp,
          updateFnPropS.local("amountDecimal")
        ),
      }),
    }),
    amountPercent: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: valueSourceOverrides("percentDollarsSource", {
        amountPercent: updateBasicsS.loadFromLocal("amountPercentEditor"),
        offPercent: updateBasicsS.equationSimple(
          "oneHundredMinus",
          updateFnPropS.local("offPercent")
        ),
        amountDollars: updateBasicsS.equationSimple(
          "decimalToPercent",
          updateFnPropS.local("amountDecimal")
        ),
        offDollars: updateBasicsS.equationSimple(
          "decimalToPercent",
          updateFnPropS.local("amountDecimal")
        ),
      }),
    }),
    offPercent: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: valueSourceOverrides("percentDollarsSource", {
        offPercent: updateBasicsS.loadFromLocal("offPercentEditor"),
        amountPercent: updateBasicsS.equationSimple(
          "oneHundredMinus",
          updateFnPropS.local("amountPercent")
        ),
        amountDollars: updateBasicsS.equationSimple(
          "decimalToPercent",
          updateFnPropS.local("offDecimal")
        ),
        offDollars: updateBasicsS.equationSimple(
          "decimalToPercent",
          updateFnPropS.local("offDecimal")
        ),
      }),
    }),
    amountDecimal: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: valueSourceOverrides("percentDollarsSource", {
        amountDollars: updateBasicsS.equationLeftRight(
          "simpleDivide",
          updateFnPropS.local("amountDollars"),
          percentOfWhatProp
        ),
        offDollars: updateBasicsS.equationLeftRight(
          "simpleDivide",
          updateFnPropS.local("amountDollars"),
          percentOfWhatProp
        ),
        amountPercent: updateBasicsS.equationSimple(
          "percentToDecimal",
          updateFnPropS.local("amountPercent")
        ),
        offPercent: updateBasicsS.equationSimple(
          "percentToDecimal",
          updateFnPropS.local("amountPercent")
        ),
      }),
    }),
    offDecimal: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: valueSourceOverrides("percentDollarsSource", {
        amountDollars: updateBasicsS.equationLeftRight(
          "simpleDivide",
          updateFnPropS.local("offDollars"),
          percentOfWhatProp
        ),
        offDollars: updateBasicsS.equationLeftRight(
          "simpleDivide",
          updateFnPropS.local("offDollars"),
          percentOfWhatProp
        ),
        amountPercent: updateBasicsS.equationSimple(
          "percentToDecimal",
          updateFnPropS.local("offPercent")
        ),
        offPercent: updateBasicsS.equationSimple(
          "percentToDecimal",
          updateFnPropS.local("offPercent")
        ),
      }),
    }),
  } as const;
}
