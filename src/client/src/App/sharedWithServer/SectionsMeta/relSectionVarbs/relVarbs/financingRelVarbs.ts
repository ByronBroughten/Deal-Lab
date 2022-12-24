import { PiCalculationName } from "../../baseSectionsVarbs/baseValues/calculations/piCalculations";
import { numObj } from "../../baseSectionsVarbs/baseValues/NumObj";
import { switchNames } from "../../baseSectionsVarbs/RelSwitchVarb";
import { loanVarbsNotInFinancing } from "../../baseSectionsVarbs/specialVarbNames";
import { relVarbInfoS } from "../../SectionInfo/RelVarbInfo";
import { relVarb, relVarbS } from "../rel/relVarb";
import { updateFnPropS, updateFnPropsS } from "../rel/UpdateFnProps";
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
      updateFnProps: { num: updateFnPropS.local(loanBase.percent) },
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(loanBase.switch),
          switchValue: "dollars",
          updateFnName: "simpleDivide",
          updateFnProps: {
            leftSide: updateFnPropS.local("loanBaseDollars"),
            rightSide: updateFnPropS.pathName("propertyGeneralFocal", "price"),
          },
        },
      ],
    }),
    [loanBase.percent]: relVarbS.percentObj("Base loan", {
      displayNameEnd: " percent",
      updateFnName: "loadSolvableText",
      updateFnProps: {
        switch: updateFnPropS.local(loanBase.switch),
        varbInfo: updateFnPropS.local("loanBasePercentEditor"),
      },
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(loanBase.switch),
          switchValue: "dollars",
          updateFnName: "decimalToPercent",
          updateFnProps: {
            switch: updateFnPropS.local(loanBase.switch),
            num: updateFnPropS.local(loanBase.decimal),
          },
        },
      ],
    }),
    [loanBase.dollars]: relVarbS.moneyObj("Base loan", {
      displayNameEnd: " dollars",
      updateFnName: "loadSolvableText",
      updateFnProps: {
        switch: updateFnPropS.local(loanBase.switch),
        varbInfo: updateFnPropS.local("loanBaseDollarsEditor"),
      },
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(loanBase.switch),
          switchValue: "percent",
          updateFnName: "simpleMultiply",
          updateFnProps: {
            switch: updateFnPropS.local(loanBase.switch),
            leftSide: updateFnPropS.local(loanBase.decimal),
            rightSide: updateFnPropS.pathName("propertyGeneralFocal", "price"),
          },
        },
      ],
    }),
    loanBaseDollarsEditor: relVarbS.moneyObj("Loan amount", {
      initNumber: 0,
    }),
    loanBasePercentEditor: relVarbS.percentObj("Loan amount", {
      initNumber: 5,
    }),
    loanTotalDollars: relVarbS.sumMoney("Loan amount", [
      updateFnPropS.local("loanBaseDollars"),
      updateFnPropS.children("wrappedInLoanListGroup", "total"),
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
      updateFnPropS.children("closingCostListGroup", "total"),
    ]),
    wrappedInLoan: relVarbS.sumMoney("Wrapped in loan", [
      updateFnPropS.children("wrappedInLoanListGroup", "total"),
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
          inUpdateSwitchProps: [
            {
              switchInfo: relVarbInfoS.local("piCalculationName"),
              switchValue: "interestOnlySimple",
              updateFnName: "loadNumObj",
              updateFnProps: {
                varbInfo: updateFnPropS.local("interestOnlySimpleMonthly"),
              },
            },
          ],
        },
        yearly: {
          updateFnName: "loadNumObj",
          updateFnProps: {
            varbInfo: updateFnPropS.local("piFixedStandardYearly"),
          },
          inUpdateSwitchProps: [
            {
              switchInfo: relVarbInfoS.local("piCalculationName"),
              switchValue: "interestOnlySimple",
              updateFnName: "loadNumObj",
              updateFnProps: {
                varbInfo: updateFnPropS.local("interestOnlySimpleYearly"),
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
