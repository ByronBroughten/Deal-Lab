import { PathInVarbInfo } from "../sectionChildrenDerived/RelInOutVarbInfo";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { UpdateVarb, updateVarb, uvS } from "../updateSectionVarbs/updateVarb";
import {
  ubS,
  updateBasicsS,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  updateFnProp,
  updatePropS,
  upS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { updateOverride } from "../updateSectionVarbs/updateVarb/UpdateOverride";
import {
  uosS,
  UpdateOverrides,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { osS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { unionValueArr } from "../values/StateValue/unionValues";

export function loanValueUpdateVarbs(
  percentOfWhatInfo: PathInVarbInfo
): UpdateSectionVarbs<"purchaseLoanValue"> {
  return {
    ...updateVarbsS._typeUniformity,
    completionStatus: loanValueCompletionStatus(),
    valueSourceName: updateVarb("percentDollarsSource", {
      initValue: "offPercentEditor",
    }),

    offPercentEditor: updateVarb("numObj"),
    offDollarsEditor: updateVarb("numObj"),
    amountPercentEditor: updateVarb("numObj"),
    amountDollarsEditor: updateVarb("numObj"),

    offDollars: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: uosS.valueSource("percentDollarsSource", {
        offDollarsEditor: updateBasicsS.loadLocal("offDollarsEditor"),
        amountDollarsEditor: updateBasicsS.equationLR(
          "subtract",
          updateFnProp(percentOfWhatInfo),
          updatePropS.local("amountDollars")
        ),
        offPercentEditor: updateBasicsS.equationLR(
          "multiply",
          updateFnProp(percentOfWhatInfo),
          updatePropS.local("offDecimal")
        ),
        amountPercentEditor: updateBasicsS.equationLR(
          "multiply",
          updateFnProp(percentOfWhatInfo),
          updatePropS.local("offDecimal")
        ),
      }),
    }),
    amountDollars: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: uosS.valueSource("percentDollarsSource", {
        amountDollarsEditor: updateBasicsS.loadLocal("amountDollarsEditor"),
        offDollarsEditor: updateBasicsS.equationLR(
          "subtract",
          updateFnProp(percentOfWhatInfo),
          updatePropS.local("offDollars")
        ),
        amountPercentEditor: updateBasicsS.equationLR(
          "multiply",
          updateFnProp(percentOfWhatInfo),
          updatePropS.local("amountDecimal")
        ),
        offPercentEditor: updateBasicsS.equationLR(
          "multiply",
          updateFnProp(percentOfWhatInfo),
          updatePropS.local("amountDecimal")
        ),
      }),
    }),
    amountPercent: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: uosS.valueSource("percentDollarsSource", {
        amountPercentEditor: updateBasicsS.loadLocal("amountPercentEditor"),
        offPercentEditor: updateBasicsS.equationSimple(
          "oneHundredMinus",
          updatePropS.local("offPercentEditor")
        ),
        amountDollarsEditor: updateBasicsS.equationSimple(
          "decimalToPercent",
          updatePropS.local("amountDecimal")
        ),
        offDollarsEditor: updateBasicsS.equationSimple(
          "decimalToPercent",
          updatePropS.local("amountDecimal")
        ),
      }),
    }),
    offPercent: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: uosS.valueSource("percentDollarsSource", {
        offPercentEditor: updateBasicsS.loadLocal("offPercentEditor"),
        amountPercentEditor: updateBasicsS.equationSimple(
          "oneHundredMinus",
          updatePropS.local("amountPercent")
        ),
        amountDollarsEditor: updateBasicsS.equationSimple(
          "decimalToPercent",
          updatePropS.local("offDecimal")
        ),
        offDollarsEditor: updateBasicsS.equationSimple(
          "decimalToPercent",
          updatePropS.local("offDecimal")
        ),
      }),
    }),
    amountDecimal: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: uosS.valueSource("percentDollarsSource", {
        amountDollarsEditor: updateBasicsS.equationLR(
          "divide",
          updatePropS.local("amountDollars"),
          updateFnProp(percentOfWhatInfo)
        ),
        offDollarsEditor: updateBasicsS.equationLR(
          "divide",
          updatePropS.local("amountDollars"),
          updateFnProp(percentOfWhatInfo)
        ),
        amountPercentEditor: updateBasicsS.equationSimple(
          "percentToDecimal",
          updatePropS.local("amountPercent")
        ),
        offPercentEditor: updateBasicsS.equationSimple(
          "percentToDecimal",
          updatePropS.local("amountPercent")
        ),
      }),
    }),
    offDecimal: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: uosS.valueSource("percentDollarsSource", {
        amountDollarsEditor: updateBasicsS.equationLR(
          "divide",
          updatePropS.local("offDollars"),
          updateFnProp(percentOfWhatInfo)
        ),
        offDollarsEditor: updateBasicsS.equationLR(
          "divide",
          updatePropS.local("offDollars"),
          updateFnProp(percentOfWhatInfo)
        ),
        amountPercentEditor: updateBasicsS.equationSimple(
          "percentToDecimal",
          updatePropS.local("offPercent")
        ),
        offPercentEditor: updateBasicsS.equationSimple(
          "percentToDecimal",
          updatePropS.local("offPercent")
        ),
      }),
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
