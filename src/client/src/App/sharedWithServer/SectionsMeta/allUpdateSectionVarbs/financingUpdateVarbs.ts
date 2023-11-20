import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { UpdateGroup } from "../updateSectionVarbs/switchUpdateVarbs";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import {
  UpdateVarb,
  updateVarb,
  updateVarbS,
  uvS,
} from "../updateSectionVarbs/updateVarb";
import {
  ubS,
  UpdateBasics,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  updatePropS,
  upS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { updateOverride } from "../updateSectionVarbs/updateVarb/UpdateOverride";
import {
  uosS,
  UpdateOverrides,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import {
  osS,
  overrideSwitchS,
} from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { numObj } from "../values/StateValue/NumObj";
import { UnionValue } from "../values/StateValue/unionValues";

export function financingUpdateVarbs(): UpdateSectionVarbs<"financing"> {
  return {
    ...updateVarbsS._typeUniformity,
    one: updateVarbS.one(),
    completionStatus: financingCompletionStatus(),
    ...sumOngoingLoanVarb("mortgageIns", "mortgageIns"),
    ...sumOngoingLoanVarb("loanExpenses", "expenses"),
    ...sumOngoingLoanVarb("loanPayment", "loanPayment"),
    ...sumOngoingLoanVarb("averagePrincipal", "averagePrincipal"),
    ...sumOngoingLoanVarb("averageInterest", "averageInterest"),
    financingMode: updateVarb("financingMode"),
    financingMethod: updateVarb("financingMethod", { initValue: "" }),
    ...updateVarbsS.monthsYearsInput("timeTillRefinance", "months", {
      months: { initValue: numObj(6) },
    }),
    displayName: updateVarb("stringObj", {
      updateFnName: "financingDisplayName",
      updateFnProps: {
        loanNames: [updatePropS.children("loan", "displayName")],
      },
    }),
    loanBaseDollars: doLoanOrZero(ubS.sumChildren("loan", "loanBaseDollars")),
    loanTotalDollars: doLoanOrZero(ubS.sumChildren("loan", "loanTotalDollars")),
    closingCosts: doLoanOrZero(ubS.sumChildren("loan", "closingCosts")),
    mortgageInsUpfront: doLoanOrZero(
      ubS.sumChildren("loan", "mortgageInsUpfront")
    ),
    loanUpfrontExpenses: doLoanOrZero(
      ubS.sumNums(
        updatePropS.local("closingCosts"),
        updatePropS.local("mortgageInsUpfront")
      )
    ),
  };
}

function financingCompletionStatus() {
  return uvS.completionStatusO(
    updateOverride(
      [osS.local("financingMethod", "", "cashOnly")],
      ubS.completionStatus({ validInputs: [upS.local("financingMethod")] })
    ),
    updateOverride(
      [osS.local("financingMethod", "useLoan")],
      ubS.completionStatus({
        othersValid: [upS.children("loan", "completionStatus")],
      })
    )
  );
}

function financingMethodOverrides(
  overrideMap: Record<UnionValue<"financingMethod">, UpdateBasics>
): UpdateOverrides {
  return uosS.union(
    "financingMethod",
    relVarbInfoS.local("financingMethod"),
    overrideMap
  );
}

function doLoanOrZero(onUseLoan: UpdateBasics): UpdateVarb<"numObj"> {
  return uvS.numObjO(
    financingMethodOverrides({
      "": ubS.zero,
      cashOnly: ubS.zero,
      useLoan: onUseLoan,
    })
  );
}

function sumOngoingLoanVarb<BN extends string>(
  financingBaseVarbName: BN,
  loanBaseVarbName: string
): UpdateGroup<BN, "periodic"> {
  return updateVarbsS.ongoingSumNumsNext(financingBaseVarbName, "monthly", {
    updateBasics: ubS.throw,
    updateOverrides: [
      {
        switches: [overrideSwitchS.local("financingMethod", "useLoan")],
        updateFnProps: [upS.children("loan", loanBaseVarbName)],
      },
      {
        switches: [overrideSwitchS.local("financingMethod", "cashOnly", "")],
        updateBasics: ubS.zero,
      },
    ],
  });
}
