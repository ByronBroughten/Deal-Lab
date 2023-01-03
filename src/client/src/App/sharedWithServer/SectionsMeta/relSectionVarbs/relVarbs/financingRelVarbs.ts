import { PiCalculationName } from "../../baseSectionsVarbs/baseValues/calculations/piCalculations";
import { numObj } from "../../baseSectionsVarbs/baseValues/NumObj";
import { switchNames } from "../../baseSectionsVarbs/RelSwitchVarb";
import { loanVarbsNotInFinancing } from "../../baseSectionsVarbs/specialVarbNames";
import { relVarb, relVarbS } from "../rel/relVarb";
import { updateBasics, updateBasicsS } from "../rel/relVarb/UpdateBasics";
import { updateFnPropS, updateFnPropsS } from "../rel/relVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
} from "../rel/relVarb/UpdateOverrides";
import { RelVarbs, relVarbsS } from "../relVarbs";

const loanBase = switchNames("loanBase", "dollarsPercentDecimal");
export function loanRelVarbs(): RelVarbs<"loan"> {
  return {
    ...relVarbsS._typeUniformity,
    ...relVarbsS.savableSection,
    [loanBase.switch]: relVarb("string", {
      initValue: "percent",
    }),
    [loanBase.decimal]: relVarbS.numObj("Base loan decimal", {
      initNumber: 0.05,
      unit: "decimal",
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(loanBase.switch, "dollars")],
          updateBasics("simpleDivide", {
            leftSide: updateFnPropS.local("loanBaseDollars"),
            rightSide: updateFnPropS.pathName("propertyGeneralFocal", "price"),
          })
        ),
        updateOverride(
          [overrideSwitchS.local(loanBase.switch, "percent")],
          updateBasicsS.equationSimple(
            "percentToDecimal",
            updateFnPropS.local(loanBase.percent)
          )
        ),
      ],
    }),
    [loanBase.percent]: relVarbS.percentObj("Base loan", {
      displayNameEnd: " percent",
      updateFnName: "loadSolvableTextByVarbInfo",
      updateFnProps: {
        switch: updateFnPropS.local(loanBase.switch),
        varbInfo: updateFnPropS.local("loanBasePercentEditor"),
      },
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(loanBase.switch, "decimal")],
          updateBasics("decimalToPercent", {
            num: updateFnPropS.local(loanBase.decimal),
          })
        ),
      ],
    }),
    [loanBase.dollars]: relVarbS.moneyObj("Base loan", {
      displayNameEnd: " dollars",
      updateFnName: "loadSolvableTextByVarbInfo",
      updateFnProps: {
        switch: updateFnPropS.local(loanBase.switch),
        varbInfo: updateFnPropS.local("loanBaseDollarsEditor"),
      },
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(loanBase.switch, "percent")],
          updateBasics("simpleMultiply", {
            leftSide: updateFnPropS.local(loanBase.decimal),
            rightSide: updateFnPropS.pathName("propertyGeneralFocal", "price"),
          })
        ),
      ],
    }),
    hasMortgageIns: relVarb("boolean"),
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
    ...relVarbsS.timeMoneyInput("mortgageIns", "Mortgage insurance", {
      switchInit: "yearly",
      shared: { initNumber: 0 },
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
    mortgageInsUpfront: relVarbS.moneyObj("Upfront mortgage insurance", {
      initNumber: 0,
    }),
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
          updateFnName: "loadNumObj",
          updateFnProps: {
            varbInfo: updateFnPropS.local("piFixedStandardMonthly"),
          },
          updateOverrides: [
            updateOverride(
              [
                overrideSwitchS.local(
                  "piCalculationName",
                  "interestOnlySimple"
                ),
              ],
              updateBasics("loadNumObj", {
                varbInfo: updateFnPropS.local("interestOnlySimpleMonthly"),
              })
            ),
          ],
        },
        yearly: {
          updateFnName: "loadNumObj",
          updateFnProps: {
            varbInfo: updateFnPropS.local("piFixedStandardYearly"),
          },
          updateOverrides: [
            updateOverride(
              [
                overrideSwitchS.local(
                  "piCalculationName",
                  "interestOnlySimple"
                ),
              ],
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
