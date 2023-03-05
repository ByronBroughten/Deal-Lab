import { VarbNameByValueName } from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { UpdateGroup } from "../updateSectionVarbs/switchUpdateVarbs";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import {
  UpdateVarb,
  updateVarb,
  updateVarbS,
} from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

function sumLoanVarb(
  loanVarbName: VarbNameByValueName<"loan", "numObj">
): UpdateVarb<"numObj"> {
  return updateVarb("numObj", {
    updateFnName: "throwIfReached",
    updateOverrides: [
      updateOverride(
        [overrideSwitchS.varbIsValue("financingMode", "useLoan")],
        updateBasicsS.sumNums(
          updateFnPropS.pathNameBase("loanFocal", loanVarbName)
        )
      ),
      updateOverride(
        [overrideSwitchS.varbIsValue("financingMode", "cashOnly", "")],
        updateBasicsS.zero
      ),
    ],
  });
}

function sumOngoingLoanVarb<BN extends string>(
  financingBaseVarbName: BN,
  loanBaseVarbName: string
): UpdateGroup<BN, "ongoing"> {
  return updateVarbsS.ongoingSumNumsNext(financingBaseVarbName, "monthly", {
    updateBasics: updateBasicsS.throw,
    updateOverrides: [
      {
        switches: [overrideSwitchS.varbIsValue("financingMode", "useLoan")],
        updateFnProps: [
          updateFnPropS.pathNameBase("loanFocal", loanBaseVarbName),
        ],
      },
      {
        switches: [
          overrideSwitchS.varbIsValue("financingMode", "cashOnly", ""),
        ],
        updateBasics: updateBasicsS.zero,
      },
    ],
  });
}

export function financingUpdateVarbs(): UpdateSectionVarbs<"financing"> {
  return {
    ...updateVarbsS._typeUniformity,
    one: updateVarbS.one(),
    financingMode: updateVarb("financingMode", { initValue: "" }),
    loanBaseDollars: sumLoanVarb("loanBaseDollars"),
    loanTotalDollars: sumLoanVarb("loanTotalDollars"),
    closingCosts: sumLoanVarb("closingCosts"),
    mortgageInsUpfront: sumLoanVarb("mortgageInsUpfront"),
    loanUpfrontExpenses: updateVarbS.sumNums([
      updateFnPropS.local("closingCosts"),
      updateFnPropS.local("mortgageInsUpfront"),
    ]),
    ...sumOngoingLoanVarb("loanExpenses", "expenses"),
    ...sumOngoingLoanVarb("mortgageIns", "mortgageIns"),
    ...sumOngoingLoanVarb("loanPayment", "loanPayment"),
  };
}
