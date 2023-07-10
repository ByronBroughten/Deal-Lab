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

const propS = updateFnPropS;
const oSwitchS = overrideSwitchS;
const basicsS = updateBasicsS;

export function loanUpdateVarbs(): UpdateSectionVarbs<"loan"> {
  return {
    ...updateVarbsS._typeUniformity,
    completionStatus: loanCompletionStatus,

    ...updateVarbsS.savableSection,
    financingMode: updateVarb("financingMode"),
    loanBaseDollars: updateVarb(
      "numObj",
      basicsS.loadFromChild("loanBaseValue", "valueDollars")
    ),
    ...updateVarbsS.periodicInput("interestRatePercent", {
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
        updateOverride([oSwitchS.localIsFalse("hasMortgageIns")], basicsS.zero),
        updateOverride(
          [oSwitchS.localIsTrue("hasMortgageIns")],
          basicsS.loadFromLocal(
            "mortgageInsUpfrontEditor"
          ) as UpdateBasics<"numObj">
        ),
      ],
    }),
    ...updateVarbsS.periodicInput("mortgageIns", {
      switchInit: "yearly",
      editor: { updateFnName: "calcVarbs" },
      monthly: {
        updateOverrides: [
          updateOverride(
            [oSwitchS.localIsFalse("hasMortgageIns")],
            basicsS.zero
          ),
          updateOverride(
            [
              oSwitchS.localIsTrue("hasMortgageIns"),
              oSwitchS.monthlyIsActive("mortgageIns"),
            ],
            basicsS.loadFromLocal(
              "mortgageInsPeriodicEditor"
            ) as UpdateBasics<"numObj">
          ),
          updateOverride(
            [
              oSwitchS.localIsTrue("hasMortgageIns"),
              oSwitchS.yearlyIsActive("mortgageIns"),
            ],
            basicsS.yearlyToMonthly("mortgageIns")
          ),
        ],
      },
      yearly: {
        updateOverrides: [
          updateOverride(
            [oSwitchS.localIsFalse("hasMortgageIns")],
            basicsS.zero
          ),
          updateOverride(
            [
              oSwitchS.localIsTrue("hasMortgageIns"),
              oSwitchS.yearlyIsActive("mortgageIns"),
            ],
            basicsS.loadFromLocal(
              "mortgageInsPeriodicEditor"
            ) as UpdateBasics<"numObj">
          ),
          updateOverride(
            [
              oSwitchS.localIsTrue("hasMortgageIns"),
              oSwitchS.monthlyIsActive("mortgageIns"),
            ],
            basicsS.monthlyToYearly("mortgageIns")
          ),
        ],
      },
    }),
    loanTotalDollars: updateVarbS.sumNums([
      propS.local("loanBaseDollars"),
      propS.children("wrappedInLoanValue", "value"),
    ]),
    ...updateVarbsS.ongoingSumNums(
      "expenses",
      [propS.localBaseName("loanPayment"), propS.localBaseName("mortgageIns")],
      "monthly"
    ),
    fivePercentBaseLoan: updateVarbS.singlePropFn(
      "fivePercent",
      propS.local("loanBaseDollars")
    ),
    closingCosts: updateVarbS.sumNums(
      [propS.children("closingCostValue", "value")],
      {
        updateOverrides: [
          updateOverride(
            [
              oSwitchS.child(
                "closingCostValue",
                "valueSourceName",
                "fivePercentLoan"
              ),
            ],
            basicsS.loadSolvableTextByVarbInfo("fivePercentBaseLoan")
          ),
        ],
      }
    ),
    piCalculationName: updateVarb("string", {
      initValue: "piFixedStandard" as PiCalculationName,
    }),
    ...updateVarbsS.ongoingPureCalc("interestRateDecimal", {
      monthly: {
        updateFnName: "percentToDecimal",
        updateFnProps: {
          num: propS.local("interestRatePercentMonthly"),
        },
      },
      yearly: {
        updateFnName: "percentToDecimal",
        updateFnProps: {
          num: propS.local("interestRatePercentYearly"),
        },
      },
    }),
    ...updateVarbsS.ongoingPureCalc("interestOnlySimple", {
      monthly: {
        updateFnName: "yearlyToMonthly",
        updateFnProps: {
          num: propS.local("interestOnlySimpleYearly"),
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

    ...updateVarbsS.ongoingPureCalc("averagePrincipal", {
      monthly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [oSwitchS.localIsTrue("isInterestOnly")],
            basicsS.zero
          ),
          updateOverride(
            [oSwitchS.localIsFalse("isInterestOnly")],
            basicsS.equationLR(
              "divide",
              propS.local("loanTotalDollars"),
              propS.local("loanTermMonths")
            )
          ),
        ],
      },
      yearly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [oSwitchS.localIsTrue("isInterestOnly")],
            basicsS.zero
          ),
          updateOverride(
            [oSwitchS.localIsFalse("isInterestOnly")],
            basicsS.equationLR(
              "divide",
              propS.local("loanTotalDollars"),
              propS.local("loanTermYears")
            )
          ),
        ],
      },
    }),
    ...updateVarbsS.ongoingPureCalc("averageInterest", {
      monthly: basicsS.equationLR(
        "subtract",
        propS.local("loanPaymentMonthly"),
        propS.local("averagePrincipalMonthly")
      ),
      yearly: basicsS.equationLR(
        "subtract",
        propS.local("loanPaymentYearly"),
        propS.local("averagePrincipalYearly")
      ),
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
        updateFnProps: { num: propS.local("piFixedStandardMonthly") },
      },
    }),
    ...updateVarbsS.ongoingPureCalc("loanPayment", {
      monthly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [oSwitchS.local("isInterestOnly", false)],
            basicsS.loadFromLocal(
              "piFixedStandardMonthly"
            ) as UpdateBasics<"numObj">
          ),
          updateOverride(
            [oSwitchS.local("isInterestOnly", true)],
            updateBasics("loadNumObj", {
              varbInfo: propS.local("interestOnlySimpleMonthly"),
            })
          ),
        ],
      },
      yearly: {
        updateFnName: "throwIfReached",
        updateOverrides: [
          updateOverride(
            [oSwitchS.local("isInterestOnly", false)],
            basicsS.loadFromLocal(
              "piFixedStandardYearly"
            ) as UpdateBasics<"numObj">
          ),
          updateOverride(
            [oSwitchS.local("isInterestOnly", true)],
            updateBasics("loadNumObj", {
              varbInfo: propS.local("interestOnlySimpleYearly"),
            })
          ),
        ],
      },
    }),
  };
}
