import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import {
  UpdateBasics,
  updateBasics,
  updateBasicsS,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  updateFnPropS,
  updateFnPropsS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { numObj } from "../values/StateValue/NumObj";
import { PiCalculationName } from "../values/StateValue/valuesShared/calculations/piCalculations";
import { loanCompletionStatus } from "./calculatedUpdateVarbs/completionStatusVarbs";

export function loanUpdateVarbs(): UpdateSectionVarbs<"loan"> {
  return {
    ...updateVarbsS._typeUniformity,
    completionStatus: loanCompletionStatus,
    loanPurpose: updateVarb("loanPurpose", { initValue: "purchasePrice" }),
    loanAmountInputMode: updateVarb("loanAmountInputMode", {
      initValue: "downPayment",
    }),
    loanPurchasedAssetValue: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local("loanPurpose", "purchasePrice")],
          updateBasicsS.loadByVarbPathName("purchasePrice")
        ),
      ],
    }),
    ...updateVarbsS.savableSection,
    loanBaseDollars: updateVarb(
      "numObj",
      updateBasicsS.loadFromChild("loanBaseValue", "valueDollars")
    ),
    ...updateVarbsS.ongoingInputNext("interestRatePercent", {
      switchInit: "yearly",
    }),
    ...updateVarbsS.monthsYearsInput("loanTerm", "years", {
      years: { initValue: numObj(30) },
    }),
    isInterestOnly: updateVarb("boolean", {
      initValue: false,
    }),
    hasMortgageIns: updateVarb("boolean", {
      initValue: false,
    }),
    mortgageInsUpfrontEditor: updateVarb("numObj"),
    mortgageInsUpfront: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.localIsFalse("hasMortgageIns")],
          updateBasics("solvableTextZero")
        ),
        updateOverride(
          [overrideSwitchS.localIsTrue("hasMortgageIns")],
          updateBasicsS.loadFromLocal(
            "mortgageInsUpfrontEditor"
          ) as UpdateBasics<"numObj">
        ),
      ],
    }),
    ...updateVarbsS.ongoingInputNext("mortgageIns", {
      switchInit: "yearly",
      editor: { updateFnName: "calcVarbs" },
      monthly: {
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.localIsFalse("hasMortgageIns")],
            updateBasics("solvableTextZero")
          ),
          updateOverride(
            [
              overrideSwitchS.localIsTrue("hasMortgageIns"),
              overrideSwitchS.monthlyIsActive("mortgageIns"),
            ],
            updateBasicsS.loadFromLocal(
              "mortgageInsOngoingEditor"
            ) as UpdateBasics<"numObj">
          ),
          updateOverride(
            [
              overrideSwitchS.localIsTrue("hasMortgageIns"),
              overrideSwitchS.yearlyIsActive("mortgageIns"),
            ],
            updateBasicsS.yearlyToMonthly("mortgageIns")
          ),
        ],
      },
      yearly: {
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.localIsFalse("hasMortgageIns")],
            updateBasics("solvableTextZero")
          ),
          updateOverride(
            [
              overrideSwitchS.localIsTrue("hasMortgageIns"),
              overrideSwitchS.yearlyIsActive("mortgageIns"),
            ],
            updateBasicsS.loadFromLocal(
              "mortgageInsOngoingEditor"
            ) as UpdateBasics<"numObj">
          ),
          updateOverride(
            [
              overrideSwitchS.localIsTrue("hasMortgageIns"),
              overrideSwitchS.monthlyIsActive("mortgageIns"),
            ],
            updateBasicsS.monthlyToYearly("mortgageIns")
          ),
        ],
      },
    }),
    loanTotalDollars: updateVarbS.sumNums([
      updateFnPropS.local("loanBaseDollars"),
      updateFnPropS.children("wrappedInLoanValue", "value"),
    ]),
    ...updateVarbsS.ongoingSumNums(
      "expenses",
      [
        updateFnPropS.localBaseName("loanPayment"),
        updateFnPropS.localBaseName("mortgageIns"),
      ],
      "monthly"
    ),
    fivePercentBaseLoan: updateVarbS.singlePropFn(
      "fivePercent",
      updateFnPropS.local("loanBaseDollars")
    ),
    closingCosts: updateVarbS.sumNums(
      [updateFnPropS.children("closingCostValue", "value")],
      {
        updateOverrides: [
          updateOverride(
            [
              overrideSwitchS.child(
                "closingCostValue",
                "valueSourceName",
                "fivePercentLoan"
              ),
            ],
            updateBasicsS.loadSolvableTextByVarbInfo("fivePercentBaseLoan")
          ),
        ],
      }
    ),
    wrappedInLoan: updateVarbS.sumNums([
      updateFnPropS.children("wrappedInLoanValue", "value"),
    ]),
    piCalculationName: updateVarb("string", {
      initValue: "piFixedStandard" as PiCalculationName,
    }),
    ...updateVarbsS.ongoingPureCalc("interestRateDecimal", {
      monthly: {
        updateFnName: "percentToDecimal",
        updateFnProps: {
          num: updateFnPropS.local("interestRatePercentMonthly"),
        },
      },
      yearly: {
        updateFnName: "percentToDecimal",
        updateFnProps: {
          num: updateFnPropS.local("interestRatePercentYearly"),
        },
      },
    }),
    ...updateVarbsS.ongoingPureCalc("interestOnlySimple", {
      monthly: {
        updateFnName: "yearlyToMonthly",
        updateFnProps: {
          num: updateFnPropS.local("interestOnlySimpleYearly"),
        },
      },
      yearly: {
        updateFnName: "piInterestOnlySimpleYearly",
        updateFnProps: {
          ...updateFnPropsS.localByVarbName([
            "interestRateDecimalYearly",
            "loanTotalDollars",
          ]),
        },
      },
    }),
    ...updateVarbsS.ongoingPureCalc("piFixedStandard", {
      monthly: {
        updateFnName: "piFixedStandardMonthly",
        updateFnProps: updateFnPropsS.localByVarbName([
          "loanTotalDollars",
          "interestRateDecimalMonthly",
          "loanTermMonths",
        ]),
      },
      yearly: {
        updateFnName: "monthlyToYearly",
        updateFnProps: { num: updateFnPropS.local("piFixedStandardMonthly") },
      },
    }),
    ...updateVarbsS.ongoingPureCalc("loanPayment", {
      monthly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.local("isInterestOnly", false)],
            updateBasicsS.loadFromLocal(
              "piFixedStandardMonthly"
            ) as UpdateBasics<"numObj">
          ),
          updateOverride(
            [overrideSwitchS.local("isInterestOnly", true)],
            updateBasics("loadNumObj", {
              varbInfo: updateFnPropS.local("interestOnlySimpleMonthly"),
            })
          ),
        ],
      },
      yearly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [overrideSwitchS.local("isInterestOnly", false)],
            updateBasicsS.loadFromLocal(
              "piFixedStandardYearly"
            ) as UpdateBasics<"numObj">
          ),
          updateOverride(
            [overrideSwitchS.local("isInterestOnly", true)],
            updateBasics("loadNumObj", {
              varbInfo: updateFnPropS.local("interestOnlySimpleYearly"),
            })
          ),
        ],
      },
    }),
  };
}
