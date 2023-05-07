import { PathInVarbInfo } from "../sectionChildrenDerived/RelInOutVarbInfo";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { UpdateVarb, updateVarb } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  updateFnProp,
  updateFnPropS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
  UpdateOverrides,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import {
  completionStatusBasics,
  completionStatusVarb,
  valueSourceOverrides,
} from "../updateSectionVarbs/updateVarb/updateVarbUtils";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { unionValueArr } from "../values/StateValue/unionValues";

const switchS = overrideSwitchS;
const cBasics = completionStatusBasics;
const propS = updateFnPropS;

export function loanValueCompletionStatus(): UpdateVarb<"completionStatus"> {
  const sourceNames = unionValueArr("percentDollarsSource");
  const extraOverrides = sourceNames.reduce((overrides, sourceName) => {
    overrides.push(
      updateOverride(
        [switchS.local("valueSourceName", sourceName)],
        cBasics({
          validInputs: [propS.local(sourceName)],
        })
      )
    );
    return overrides;
  }, [] as UpdateOverrides);
  return completionStatusVarb(...extraOverrides);
}

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
      updateOverrides: valueSourceOverrides("percentDollarsSource", {
        offDollarsEditor: updateBasicsS.loadFromLocal("offDollarsEditor"),
        amountDollarsEditor: updateBasicsS.equationLR(
          "simpleSubtract",
          updateFnProp(percentOfWhatInfo),
          updateFnPropS.local("amountDollars")
        ),
        offPercentEditor: updateBasicsS.equationLR(
          "multiply",
          updateFnProp(percentOfWhatInfo),
          updateFnPropS.local("offDecimal")
        ),
        amountPercentEditor: updateBasicsS.equationLR(
          "multiply",
          updateFnProp(percentOfWhatInfo),
          updateFnPropS.local("offDecimal")
        ),
      }),
    }),
    amountDollars: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: valueSourceOverrides("percentDollarsSource", {
        amountDollarsEditor: updateBasicsS.loadFromLocal("amountDollarsEditor"),
        offDollarsEditor: updateBasicsS.equationLR(
          "simpleSubtract",
          updateFnProp(percentOfWhatInfo),
          updateFnPropS.local("offDollars")
        ),
        amountPercentEditor: updateBasicsS.equationLR(
          "multiply",
          updateFnProp(percentOfWhatInfo),
          updateFnPropS.local("amountDecimal")
        ),
        offPercentEditor: updateBasicsS.equationLR(
          "multiply",
          updateFnProp(percentOfWhatInfo),
          updateFnPropS.local("amountDecimal")
        ),
      }),
    }),
    amountPercent: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: valueSourceOverrides("percentDollarsSource", {
        amountPercentEditor: updateBasicsS.loadFromLocal("amountPercentEditor"),
        offPercentEditor: updateBasicsS.equationSimple(
          "oneHundredMinus",
          updateFnPropS.local("offPercent")
        ),
        amountDollarsEditor: updateBasicsS.equationSimple(
          "decimalToPercent",
          updateFnPropS.local("amountDecimal")
        ),
        offDollarsEditor: updateBasicsS.equationSimple(
          "decimalToPercent",
          updateFnPropS.local("amountDecimal")
        ),
      }),
    }),
    offPercent: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: valueSourceOverrides("percentDollarsSource", {
        offPercentEditor: updateBasicsS.loadFromLocal("offPercentEditor"),
        amountPercentEditor: updateBasicsS.equationSimple(
          "oneHundredMinus",
          updateFnPropS.local("amountPercent")
        ),
        amountDollarsEditor: updateBasicsS.equationSimple(
          "decimalToPercent",
          updateFnPropS.local("offDecimal")
        ),
        offDollarsEditor: updateBasicsS.equationSimple(
          "decimalToPercent",
          updateFnPropS.local("offDecimal")
        ),
      }),
    }),
    amountDecimal: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: valueSourceOverrides("percentDollarsSource", {
        amountDollarsEditor: updateBasicsS.equationLR(
          "divide",
          updateFnPropS.local("amountDollars"),
          updateFnProp(percentOfWhatInfo)
        ),
        offDollarsEditor: updateBasicsS.equationLR(
          "divide",
          updateFnPropS.local("amountDollars"),
          updateFnProp(percentOfWhatInfo)
        ),
        amountPercentEditor: updateBasicsS.equationSimple(
          "percentToDecimal",
          updateFnPropS.local("amountPercent")
        ),
        offPercentEditor: updateBasicsS.equationSimple(
          "percentToDecimal",
          updateFnPropS.local("amountPercent")
        ),
      }),
    }),
    offDecimal: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: valueSourceOverrides("percentDollarsSource", {
        amountDollarsEditor: updateBasicsS.equationLR(
          "divide",
          updateFnPropS.local("offDollars"),
          updateFnProp(percentOfWhatInfo)
        ),
        offDollarsEditor: updateBasicsS.equationLR(
          "divide",
          updateFnPropS.local("offDollars"),
          updateFnProp(percentOfWhatInfo)
        ),
        amountPercentEditor: updateBasicsS.equationSimple(
          "percentToDecimal",
          updateFnPropS.local("offPercent")
        ),
        offPercentEditor: updateBasicsS.equationSimple(
          "percentToDecimal",
          updateFnPropS.local("offPercent")
        ),
      }),
    }),
  } as const;
}
