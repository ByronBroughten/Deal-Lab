import { UpdateGroup } from "../updateSectionVarbs/switchUpdateVarbs";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { overrideSwitchS } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { numObj } from "../values/StateValue/NumObj";
import { financingCompletionStatus } from "./calculatedUpdateVarbs/completionStatusVarbs";

function sumOngoingLoanVarb<BN extends string>(
  financingBaseVarbName: BN,
  loanBaseVarbName: string
): UpdateGroup<BN, "periodic"> {
  return updateVarbsS.ongoingSumNumsNext(financingBaseVarbName, "monthly", {
    updateBasics: updateBasicsS.throw,
    updateOverrides: [
      {
        switches: [overrideSwitchS.local("financingMethod", "useLoan")],
        updateFnProps: [propS.children("loan", loanBaseVarbName)],
      },
      {
        switches: [overrideSwitchS.local("financingMethod", "cashOnly", "")],
        updateBasics: updateBasicsS.zero,
      },
    ],
  });
}

const propS = updateFnPropS;
export function financingUpdateVarbs(): UpdateSectionVarbs<"financing"> {
  return {
    ...updateVarbsS._typeUniformity,
    one: updateVarbS.one(),
    ...sumOngoingLoanVarb("mortgageIns", "mortgageIns"),
    ...sumOngoingLoanVarb("loanExpenses", "expenses"),
    ...sumOngoingLoanVarb("loanPayment", "loanPayment"),
    completionStatus: financingCompletionStatus,
    downPaymentDollars: updateVarbS.equationLR(
      "subtract",
      propS.varbPathName("purchasePrice"),
      propS.local("loanBaseDollars")
    ),
    downPaymentPercent: updateVarbS.singlePropFn(
      "decimalToPercent",
      propS.local("downPaymentDecimal")
    ),
    downPaymentDecimal: updateVarbS.equationLR(
      "divide",
      propS.local("downPaymentDollars"),
      propS.varbPathName("purchasePrice")
    ),
    financingMode: updateVarb("financingMode"),
    financingMethod: updateVarb("financingMethod", { initValue: "" }),
    ...updateVarbsS.group("timeTillRefinance", "monthsYearsInput", "months", {
      months: { initValue: numObj(6) },
    }),
    displayName: updateVarb("stringObj", {
      updateFnName: "financingDisplayName",
      updateFnProps: {
        loanNames: [updateFnPropS.children("loan", "displayName")],
      },
    }),
    loanBaseDollars: updateVarbS.sumChildNums("loan", "loanBaseDollars"),
    loanTotalDollars: updateVarbS.sumChildNums("loan", "loanBaseDollars"),
    closingCosts: updateVarbS.sumChildNums("loan", "loanBaseDollars"),
    mortgageInsUpfront: updateVarbS.sumChildNums("loan", "loanBaseDollars"),
    loanUpfrontExpenses: updateVarbS.sumNums([
      updateFnPropS.local("closingCosts"),
      updateFnPropS.local("mortgageInsUpfront"),
    ]),
  };
}
