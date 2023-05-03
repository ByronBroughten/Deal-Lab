import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { valueSourceOverrides } from "../updateSectionVarbs/updateVarb/updateVarbUtils";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { StateValue } from "../values/StateValue";
import { UpdateBasics } from "./../updateSectionVarbs/updateVarb/UpdateBasics";

const basicsS = updateBasicsS;
function sourceOverrides(
  overrideMap: Record<StateValue<"loanBaseValueSource">, UpdateBasics>
) {
  return updateVarb("numObj", {
    updateFnName: "throwIfReached",
    updateOverrides: valueSourceOverrides("loanBaseValueSource", overrideMap),
  });
}

export function loanBaseUpdateVarbs(): UpdateSectionVarbs<"loanBaseValue"> {
  return {
    ...updateVarbsS._typeUniformity,
    valueSourceName: updateVarb("loanBaseValueSource", {
      initValue: "purchaseLoanValue",
    }),
    valueDollarsEditor: updateVarb("numObj"),
    valueDollars: sourceOverrides({
      purchaseLoanValue: updateBasicsS.loadFromChild(
        "purchaseLoanValue",
        "amountDollars"
      ),
      repairLoanValue: updateBasicsS.loadFromChild(
        "repairLoanValue",
        "amountDollars"
      ),
      arvLoanValue: updateBasicsS.loadFromChild(
        "repairLoanValue",
        "amountDollars"
      ),
      customAmountEditor: updateBasicsS.loadFromLocal("valueDollarsEditor"),
      priceAndRepairValues: updateBasicsS.sumNums(
        updateFnPropS.onlyChild("purchaseLoanValue", "amountDollars"),
        updateFnPropS.onlyChild("repairLoanValue", "amountDollars")
      ),
    }),
  };
}
