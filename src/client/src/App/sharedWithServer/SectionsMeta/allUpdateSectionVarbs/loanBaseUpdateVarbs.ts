import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, uvS } from "../updateSectionVarbs/updateVarb";
import {
  ubS,
  updateBasics,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  updatePropS,
  upS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  UpdateOverride,
  updateOverride,
} from "../updateSectionVarbs/updateVarb/UpdateOverride";
import { uosS } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { osS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { StateValue } from "../values/StateValue";
import { financingModes } from "../values/StateValue/financingMode";
import { Obj } from "./../../utils/Obj";

const oRide = updateOverride;

type Overrides = Record<StateValue<"loanBaseValueSource">, UpdateOverride>;
const overrideMap: Overrides = {
  purchaseLoanValue: oRide(
    [
      osS.local("financingMode", "purchase"),
      osS.valueSourceIs("purchaseLoanValue"),
    ],
    // these need the switch to trigger the override
    ubS.equationLR(
      "add",
      upS.onlyChild("purchaseLoanValue", "amountDollars"),
      upS.onlyChild("loanBaseExtra", "valueDollars")
    )
  ),
  repairLoanValue: oRide(
    [
      osS.local("financingMode", "purchase"),
      osS.valueSourceIs("repairLoanValue"),
    ],
    ubS.equationLR(
      "add",
      upS.onlyChild("repairLoanValue", "amountDollars"),
      upS.onlyChild("loanBaseExtra", "valueDollars")
    )
  ),
  priceAndRepairValues: oRide(
    [
      osS.local("financingMode", "purchase"),
      osS.valueSourceIs("priceAndRepairValues"),
    ],
    ubS.sumNums(
      updatePropS.onlyChild("purchaseLoanValue", "amountDollars"),
      updatePropS.onlyChild("repairLoanValue", "amountDollars"),
      upS.onlyChild("loanBaseExtra", "valueDollars")
    )
  ),
  arvLoanValue: oRide(
    [
      osS.local("financingMode", "refinance"),
      osS.valueSourceIs("arvLoanValue"),
    ],
    ubS.equationLR(
      "add",
      upS.onlyChild("arvLoanValue", "amountDollars"),
      upS.onlyChild("loanBaseExtra", "valueDollars")
    )
  ),
  customAmountEditor: oRide(
    [osS.valueSourceIs("customAmountEditor")],
    ubS.loadChild("customLoanBase", "valueDollars")
  ),
};

const overrides = Obj.values(overrideMap);

export function loanBaseUpdateVarbs(): UpdateSectionVarbs<"loanBaseValue"> {
  return {
    ...updateVarbsS._typeUniformity,
    completionStatus: loanBaseCompletionStatus(),
    valueSourceName: updateVarb("loanBaseValueSource", {
      initValue: "purchaseLoanValue",
    }),
    financingMode: updateVarb("financingMode"),
    valueDollars: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        ...overrides,
        oRide(
          [osS.local("financingMode", ...financingModes)],
          updateBasics("emptyNumObj")
        ),
      ],
    }),
  };
}

export function loanBaseCompletionStatus() {
  return uvS.completionStatusO(
    ...uosS.valueSource("loanBaseValueSource", {
      purchaseLoanValue: ubS.completionStatus({
        othersValid: [upS.onlyChild("purchaseLoanValue", "completionStatus")],
      }),
      repairLoanValue: ubS.completionStatus({
        othersValid: [upS.onlyChild("repairLoanValue", "completionStatus")],
      }),
      arvLoanValue: ubS.completionStatus({
        othersValid: [upS.onlyChild("arvLoanValue", "completionStatus")],
      }),
      priceAndRepairValues: ubS.completionStatus({
        othersValid: [
          upS.onlyChild("purchaseLoanValue", "completionStatus"),
          upS.onlyChild("repairLoanValue", "completionStatus"),
        ],
      }),
      customAmountEditor: ubS.completionStatus({
        notEmptySolvable: [upS.onlyChild("customLoanBase", "valueDollars")],
      }),
    })
  );
}
