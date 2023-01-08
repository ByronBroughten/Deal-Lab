import { PiCalculationName } from "../../baseSectionsVarbs/baseValues/calculations/piCalculations";
import { numObj } from "../../baseSectionsVarbs/baseValues/NumObj";
import { switchNames } from "../../baseSectionsVarbs/RelSwitchVarb";
import { loanVarbsNotInFinancing } from "../../baseSectionsVarbs/specialVarbNames";
import { relVarb, relVarbS } from "../rel/relVarb";
import {
  UpdateBasics,
  updateBasics,
  updateBasicsS,
} from "../rel/relVarb/UpdateBasics";
import { updateFnPropS, updateFnPropsS } from "../rel/relVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
} from "../rel/relVarb/UpdateOverrides";
import { RelVarbs, relVarbsS } from "../relVarbs";

export function loanRelVarbs(): RelVarbs<"loan"> {
  return {
    ...relVarbsS._typeUniformity,
    ...relVarbsS.savableSection,
    ...loanAmount(),
    isInterestOnly: relVarb("boolean", {
      initValue: false,
    }),
    loanBaseDollarsEditor: relVarbS.moneyObj("Loan amount", {
      initNumber: 0,
    }),
    loanBasePercentEditor: relVarbS.percentObj("Loan amount", {
      initNumber: 5,
    }),
    loanTotalDollars: relVarbS.sumMoney("Loan amount", [
      updateFnPropS.local("loanBaseDollars"),
      updateFnPropS.children("wrappedInLoanValue", "value"),
    ]),
    ...relVarbsS.ongoingInput("interestRatePercent", "Interest rate", {
      switchInit: "yearly",
      yearly: { endAdornment: "% annual" },
      monthly: { endAdornment: "% monthly" },
      shared: { unit: "percent" },
    }),
    ...relVarbsS.monthsYearsInput("loanTerm", "Loan term", {
      switchInit: "years",
      years: { initValue: numObj(30) },
    }),
    mortgageInsOngoingEditor: relVarbS.moneyYear("Mortgage insurance"),
    mortgageInsUpfrontInput: relVarbS.numObj("Mortgage insurance upfront"),
    hasMortgageIns: relVarb("boolean", {
      initValue: false,
    }),
    ...relVarbsS.timeMoneyInput("mortgageIns", "Mortgage insurance", {
      switchInit: "yearly",
      shared: {
        updateFnName: "throwIfReached",
        initNumber: 0,
      },
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
    mortgageInsUpfront: relVarbS.moneyObj("Upfront mortgage insurance", {
      initNumber: 0,
    }),
    ...relVarbsS.ongoingSumNums(
      "expenses",
      "Ongoing expenses",
      [updateFnPropS.local("loanPayment"), updateFnPropS.local("mortgageIns")],
      {
        switchInit: "monthly",
        shared: { startAdornment: "$" },
      }
    ),
    closingCosts: relVarbS.sumMoney("Closing costs", [
      updateFnPropS.children("closingCostValue", "value"),
    ]),
    wrappedInLoan: relVarbS.sumMoney("Wrapped in loan", [
      updateFnPropS.children("wrappedInLoanValue", "value"),
    ]),
    piCalculationName: relVarb("string", {
      initValue: "piFixedStandard" as PiCalculationName,
    }),
    ...relVarbsS.ongoingPureCalc(
      "interestRateDecimal",
      "interest rate decimal",
      {
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
      },
      { shared: { unit: "decimal" } }
    ),
    ...relVarbsS.ongoingPureCalc(
      "interestOnlySimple",
      "Interest only loan payment",
      {
        monthly: {
          updateFnName: "yearlyToMonthly",
          updateFnProps: {
            num: updateFnPropS.local("interestOnlySimpleYearly"),
          },
        },
        yearly: {
          updateFnName: "interestOnlySimpleYearly",
          updateFnProps: {
            ...updateFnPropsS.localByVarbName([
              "interestRateDecimalYearly",
              "loanTotalDollars",
            ]),
          },
        },
      },
      { shared: { startAdornment: "$", unit: "money" } }
    ),
    ...relVarbsS.ongoingPureCalc(
      "piFixedStandard",
      "Loan payment",
      {
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
      },
      { shared: { startAdornment: "$", unit: "money" } }
    ),
    ...relVarbsS.ongoingPureCalc(
      "loanPayment",
      "Loan payment",
      {
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
      },
      { shared: { startAdornment: "$", unit: "money" } }
    ),
  };
}

export const financingRelVarbs: RelVarbs<"financing"> = {
  ...relVarbsS.sumSection("loan", loanRelVarbs(), loanVarbsNotInFinancing),
  ...relVarbsS.sectionStrings("loan", loanRelVarbs(), loanVarbsNotInFinancing),
};

function loanAmount() {
  const baseNames = switchNames("loanBase", "dollarsPercentDecimal");
  const percentEditorName = `${baseNames.percent}Editor` as const;
  const dollarsEditorName = `${baseNames.dollars}Editor` as const;
  const baseDisplayName = "Loan Amount";
  const propToDivideBy = updateFnPropS.pathName(
    "propertyGeneralFocal",
    "price"
  );
  return {
    [baseNames.switch]: relVarb("string", {
      initValue: "percent",
    }),
    [percentEditorName]: relVarbS.percentObj(baseDisplayName, {
      initNumber: 0,
      endAdornment: "%",
    }),
    [dollarsEditorName]: relVarbS.moneyMonth(`${baseDisplayName} dollars`, {
      initNumber: 0,
    }),
    [baseNames.decimal]: relVarbS.numObj(`${baseDisplayName} decimal`, {
      initNumber: 0.05,
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "percent")],
          updateBasicsS.equationSimple(
            "percentToDecimal",
            updateFnPropS.local(baseNames.percent)
          )
        ),
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "dollars")],
          updateBasicsS.equationLeftRight(
            "simpleDivide",
            updateFnPropS.local(baseNames.dollars),
            propToDivideBy
          )
        ),
      ],
    }),
    [baseNames.percent]: relVarbS.percentObj(baseDisplayName, {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "percent")],
          updateBasicsS.loadFromLocal(
            percentEditorName
          ) as UpdateBasics<"numObj">
        ),
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "dollars")],
          updateBasicsS.equationSimple(
            "decimalToPercent",
            updateFnPropS.local(baseNames.decimal)
          )
        ),
      ],
      displayNameEnd: " percent",
    }),
    [baseNames.dollars]: relVarbS.moneyObj(baseDisplayName, {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "dollars")],
          updateBasicsS.loadFromLocal(
            dollarsEditorName
          ) as UpdateBasics<"numObj">
        ),
        updateOverride(
          [overrideSwitchS.local(baseNames.switch, "percent")],
          updateBasicsS.equationLeftRight(
            "simpleMultiply",
            updateFnPropS.local(baseNames.decimal),
            propToDivideBy
          )
        ),
      ],
    }),
  } as const;
}
