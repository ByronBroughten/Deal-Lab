import { relVarbInfoS } from "../../../SectionInfos/RelVarbInfo";
import { GroupVarbNameBase } from "../../derivedFromBaseSchemas/baseGroupNames";
import { GroupKey, groupNameEnding } from "../../GroupName";
import { UnionValue } from "../../StateValue/unionValues";
import { UpdateSectionVarbs, usvs } from "../updateSectionVarbs";
import { UpdateVarb, uvS } from "../updateVarb";
import { uosbS } from "../updateVarb/OverrideBasics";
import { ubS, UpdateBasics } from "../updateVarb/UpdateBasics";
import { updatePropS, upS } from "../updateVarb/UpdateFnProps";
import { updateOverride } from "../updateVarb/UpdateOverride";
import { uosS, UpdateOverrides } from "../updateVarb/UpdateOverrides";
import { osS } from "../updateVarb/UpdateOverrideSwitch";
import { GroupUpdateVarbs, uvsS } from "../updateVarbs";

export function financingUpdateVarbs(): UpdateSectionVarbs<"financing"> {
  return usvs("financing", {
    one: uvS.one(),
    completionStatus: financingCompletionStatus(),
    ...sumPeriodicLoanVarbs("mortgageIns", "mortgageIns"),
    ...sumPeriodicLoanVarbs("loanExpenses", "expenses"),
    ...sumPeriodicLoanVarbs("loanPayment", "loanPayment"),
    ...sumPeriodicLoanVarbs("averagePrincipal", "averagePrincipal"),
    ...sumPeriodicLoanVarbs("averageInterest", "averageInterest"),
    financingMode: uvS.input("financingMode"),
    financingMethod: uvS.input("financingMethod", { initValue: "" }),
    ...uvsS.childTimespanEditor("timeTillRefinance", "timeTillRefinance"),
    displayName: uvS.basic2("stringObj", {
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
  });
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

function sumPeriodicLoanVarbs<
  BN extends GroupVarbNameBase<"periodic", "financing">
>(
  financingBaseVarbName: BN,
  loanBaseVarbName: GroupVarbNameBase<"periodic", "loan">
): GroupUpdateVarbs<"periodic", BN> {
  return uvsS.periodic2(financingBaseVarbName, {
    monthly: sumLoanVarb(loanBaseVarbName, "monthly"),
    yearly: sumLoanVarb(loanBaseVarbName, "yearly"),
  });
}

function sumLoanVarb(
  loanBaseVarbName: GroupVarbNameBase<"periodic", "loan">,
  groupKey: GroupKey<"periodic">
) {
  const ending = groupNameEnding("periodic", groupKey);
  return uosbS.valueSource(
    "financingMethod",
    {
      cashOnly: ubS.zero,
      "": ubS.zero,
      useLoan: ubS.sumChildren("loan", `${loanBaseVarbName}${ending}`),
    },
    {
      switchInfo: "financingMethod",
    }
  );
}
