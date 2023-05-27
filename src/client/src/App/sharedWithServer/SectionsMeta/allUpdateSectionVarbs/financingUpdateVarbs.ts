import { UpdateGroup } from "../updateSectionVarbs/switchUpdateVarbs";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import {
  UpdateVarb,
  updateVarb,
  updateVarbS,
} from "../updateSectionVarbs/updateVarb";
import {
  UpdateBasics,
  updateBasicsS,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { overrideSwitchS } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { financingMethodOverrides } from "../updateSectionVarbs/updateVarb/updateVarbUtils";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { numObj } from "../values/StateValue/NumObj";
import { financingCompletionStatus } from "./calculatedUpdateVarbs/completionStatusVarbs";

const basicsS = updateBasicsS;

function useLoanOrZero(onUseLoan: UpdateBasics): UpdateVarb<"numObj"> {
  return updateVarb("numObj", {
    updateFnName: "throwIfReached",
    updateOverrides: financingMethodOverrides({
      "": basicsS.zero,
      cashOnly: basicsS.zero,
      useLoan: onUseLoan,
    }),
  });
}

function sumOngoingLoanVarb<BN extends string>(
  financingBaseVarbName: BN,
  loanBaseVarbName: string
): UpdateGroup<BN, "periodic"> {
  return updateVarbsS.ongoingSumNumsNext(financingBaseVarbName, "monthly", {
    updateBasics: basicsS.throw,
    updateOverrides: [
      {
        switches: [overrideSwitchS.local("financingMethod", "useLoan")],
        updateFnProps: [propS.children("loan", loanBaseVarbName)],
      },
      {
        switches: [overrideSwitchS.local("financingMethod", "cashOnly", "")],
        updateBasics: basicsS.zero,
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
    loanBaseDollars: useLoanOrZero(
      basicsS.sumChildren("loan", "loanBaseDollars")
    ),
    loanTotalDollars: useLoanOrZero(
      basicsS.sumChildren("loan", "loanTotalDollars")
    ),
    closingCosts: useLoanOrZero(basicsS.sumChildren("loan", "closingCosts")),
    mortgageInsUpfront: useLoanOrZero(
      basicsS.sumChildren("loan", "mortgageInsUpfront")
    ),
    loanUpfrontExpenses: useLoanOrZero(
      basicsS.sumNums(
        updateFnPropS.local("closingCosts"),
        updateFnPropS.local("mortgageInsUpfront")
      )
    ),
  };
}
