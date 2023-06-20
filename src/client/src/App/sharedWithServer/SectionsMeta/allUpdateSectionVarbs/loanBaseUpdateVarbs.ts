import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { valueSourceOverrides } from "../updateSectionVarbs/updateVarb/updateVarbUtils";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { StateValue } from "../values/StateValue";
import { Obj } from "./../../utils/Obj";
import { UpdateBasics } from "./../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  overrideSwitch,
  overrideSwitchS,
  UpdateOverride,
  updateOverride,
} from "./../updateSectionVarbs/updateVarb/UpdateOverrides";
import { baseLoanCompletionStatus } from "./calculatedUpdateVarbs/completionStatusVarbs";

const oRide = updateOverride;
const oSwitch = overrideSwitch;
const switchS = overrideSwitchS;
const basics = updateBasicsS;
const prop = updateFnPropS;

function sourceOverrides(
  overrideMap: Record<StateValue<"loanBaseValueSource">, UpdateBasics>
) {
  return updateVarb("numObj", {
    updateFnName: "throwIfReached",
    updateOverrides: valueSourceOverrides("loanBaseValueSource", overrideMap),
  });
}

type Overrides = Record<StateValue<"loanBaseValueSource">, UpdateOverride>;
const overrideMap: Overrides = {
  purchaseLoanValue: oRide(
    [
      switchS.local("financingMode", "purchase"),
      switchS.valueSourceIs("purchaseLoanValue"),
    ],
    basics.equationLR(
      "add",
      prop.onlyChild("purchaseLoanValue", "amountDollars"),
      prop.onlyChild("loanBaseExtra", "valueDollars")
    )
  ),
  repairLoanValue: oRide(
    [
      switchS.local("financingMode", "purchase"),
      switchS.valueSourceIs("repairLoanValue"),
    ],
    basics.equationLR(
      "add",
      prop.onlyChild("repairLoanValue", "amountDollars"),
      prop.onlyChild("loanBaseExtra", "valueDollars")
    )
  ),
  priceAndRepairValues: oRide(
    [
      switchS.local("financingMode", "purchase"),
      switchS.valueSourceIs("priceAndRepairValues"),
    ],
    basics.sumNums(
      updateFnPropS.onlyChild("purchaseLoanValue", "amountDollars"),
      updateFnPropS.onlyChild("repairLoanValue", "amountDollars"),
      prop.onlyChild("loanBaseExtra", "valueDollars")
    )
  ),
  arvLoanValue: oRide(
    [
      switchS.local("financingMode", "refinance"),
      switchS.valueSourceIs("repairLoanValue"),
    ],
    basics.equationLR(
      "add",
      prop.onlyChild("arvLoanValue", "amountDollars"),
      prop.onlyChild("loanBaseExtra", "valueDollars")
    )
  ),
  customAmountEditor: oRide(
    [switchS.valueSourceIs("customAmountEditor")],
    basics.loadFromChild("customLoanBase", "valueDollars")
  ),
};

const overrides = Obj.values(overrideMap);

export function loanBaseUpdateVarbs(): UpdateSectionVarbs<"loanBaseValue"> {
  return {
    ...updateVarbsS._typeUniformity,
    completionStatus: baseLoanCompletionStatus(),
    valueSourceName: updateVarb("loanBaseValueSource", {
      initValue: "purchaseLoanValue",
    }),
    financingMode: updateVarb("financingMode"),
    valueDollars: updateVarb("numObj", {
      updateFnName: "emptyNumObj",
      updateOverrides: overrides,
    }),
  };
}
