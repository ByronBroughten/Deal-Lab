import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { valueSourceOverrides } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

export function loanBaseUpdateVarbs(): UpdateSectionVarbs<"loanBaseValue"> {
  return {
    ...updateVarbsS._typeUniformity,
    valueSourceName: updateVarb("loanBaseValueSourceNext", {
      initValue: "purchaseLoanValue",
    }),
    valueDollarsEditor: updateVarb("numObj"),
    valueDollars: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: valueSourceOverrides("loanBaseValueSourceNext", {
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
    }),
  };
}
