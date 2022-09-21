import { loanVarbsNotInFinancing } from "../../baseSections";
import { PiCalculationName } from "../../baseSectionsUtils/baseValues/calculations/piCalculations";
import { numObj } from "../../baseSectionsUtils/baseValues/NumObj";
import { switchNames } from "../../baseSectionsUtils/RelSwitchVarb";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relVarb, relVarbS } from "../rel/relVarb";
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
      updateFnName: "percentToDecimal",
      updateFnProps: { num: relVarbInfoS.local(loanBase.percent) },
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(loanBase.switch),
          switchValue: "dollars",
          updateFnName: "simpleDivide",
          updateFnProps: {
            leftSide: relVarbInfoS.local("loanBaseDollars"),
            rightSide: relVarbInfoS.pibling(
              "propertyGeneral",
              "propertyGeneral",
              "price",
              {
                expectedCount: "onlyOne",
              }
            ),
          },
        },
      ],
    }),
    [loanBase.percent]: relVarbS.calcVarb("Base loan", {
      initNumber: 5,
      unit: "percent",
      displayNameEnd: " percent",
      endAdornment: "%",
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(loanBase.switch),
          switchValue: "dollars",
          updateFnName: "decimalToPercent",
          updateFnProps: {
            num: relVarbInfoS.local(loanBase.decimal),
          },
        },
      ],
    }),
    [loanBase.dollars]: relVarbS.calcVarb("Base loan", {
      displayNameEnd: " dollars",
      startAdornment: "$",
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(loanBase.switch),
          switchValue: "percent",
          updateFnName: "simpleMultiply",
          updateFnProps: {
            leftSide: relVarbInfoS.local(loanBase.decimal),
            rightSide: relVarbInfoS.pibling(
              "propertyGeneral",
              "propertyGeneral",
              "price",
              {
                expectedCount: "onlyOne",
              }
            ),
          },
        },
      ],
    }),
    loanTotalDollars: relVarbS.sumMoney("Loan amount", [
      relVarbInfoS.local("loanBaseDollars"),
      relVarbInfoS.children("wrappedInLoanListGroup", "total"),
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
      [relVarbInfoS.local("loanPayment"), relVarbInfoS.local("mortgageIns")],
      {
        switchInit: "monthly",
        shared: { startAdornment: "$" },
      }
    ),
    mortgageInsUpfront: relVarbS.moneyObj("Upfront mortgage insurance", {
      initNumber: 0,
    }),
    closingCosts: relVarbS.sumMoney("Closing costs", [
      relVarbInfoS.children("closingCostListGroup", "total"),
    ]),
    wrappedInLoan: relVarbS.sumMoney("Amount wrapped in loan", [
      relVarbInfoS.children("wrappedInLoanListGroup", "total"),
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
            num: relVarbInfoS.local("interestRatePercentMonthly"),
          },
        },
        yearly: {
          updateFnName: "percentToDecimal",
          updateFnProps: {
            num: relVarbInfoS.local("interestRatePercentYearly"),
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
            num: relVarbInfoS.local("interestOnlySimpleYearly"),
          },
        },
        yearly: {
          updateFnName: "interestOnlySimpleYearly",
          updateFnProps: {
            ...relVarbInfosS.localByVarbName([
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
          updateFnProps: relVarbInfosS.localByVarbName([
            "loanTotalDollars",
            "interestRateDecimalMonthly",
            "loanTermMonths",
          ]),
        },
        yearly: {
          updateFnName: "monthlyToYearly",
          updateFnProps: { num: relVarbInfoS.local("piFixedStandardMonthly") },
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
            varbInfo: relVarbInfoS.local("piFixedStandardMonthly"),
          },
          inUpdateSwitchProps: [
            {
              switchInfo: relVarbInfoS.local("piCalculationName"),
              switchValue: "interestOnlySimple",
              updateFnName: "loadNumObj",
              updateFnProps: {
                varbInfo: relVarbInfoS.local("interestOnlySimpleMonthly"),
              },
            },
          ],
        },
        yearly: {
          updateFnName: "loadNumObj",
          updateFnProps: {
            varbInfo: relVarbInfoS.local("piFixedStandardYearly"),
          },
          inUpdateSwitchProps: [
            {
              switchInfo: relVarbInfoS.local("piCalculationName"),
              switchValue: "interestOnlySimple",
              updateFnName: "loadNumObj",
              updateFnProps: {
                varbInfo: relVarbInfoS.local("interestOnlySimpleYearly"),
              },
            },
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
