import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { valueSourceOverrides } from "../updateSectionVarbs/updateVarb/updateVarbUtils";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { StateValue } from "../values/StateValue";
import { UpdateBasics } from "./../updateSectionVarbs/updateVarb/UpdateBasics";
import { baseLoanCompletionStatus } from "./calculatedUpdateVarbs/completionStatusVarbs";

function sourceOverrides(
  overrideMap: Record<StateValue<"loanBaseValueSource">, UpdateBasics>
) {
  return updateVarb("numObj", {
    updateFnName: "throwIfReached",
    updateOverrides: valueSourceOverrides("loanBaseValueSource", overrideMap),
  });
}

const basics = updateBasicsS;
const prop = updateFnPropS;

export function loanBaseUpdateVarbs(): UpdateSectionVarbs<"loanBaseValue"> {
  return {
    ...updateVarbsS._typeUniformity,
    completionStatus: baseLoanCompletionStatus(),
    valueSourceName: updateVarb("loanBaseValueSource", {
      initValue: "purchaseLoanValue",
    }),
    valueDollarsEditor: updateVarb("numObj"),
    valueDollars: sourceOverrides({
      purchaseLoanValue: basics.equationLR(
        "add",
        prop.onlyChild("purchaseLoanValue", "amountDollars"),
        prop.onlyChild("loanBaseExtra", "valueDollars")
      ),
      repairLoanValue: basics.equationLR(
        "add",
        prop.onlyChild("repairLoanValue", "amountDollars"),
        prop.onlyChild("loanBaseExtra", "valueDollars")
      ),

      arvLoanValue: basics.equationLR(
        "add",
        prop.onlyChild("arvLoanValue", "amountDollars"),
        prop.onlyChild("loanBaseExtra", "valueDollars")
      ),
      customAmountEditor: basics.loadFromChild(
        "customLoanBase",
        "valueDollars"
      ),
      priceAndRepairValues: basics.sumNums(
        updateFnPropS.onlyChild("purchaseLoanValue", "amountDollars"),
        updateFnPropS.onlyChild("repairLoanValue", "amountDollars"),
        prop.onlyChild("loanBaseExtra", "valueDollars")
      ),
    }),
  };
}
