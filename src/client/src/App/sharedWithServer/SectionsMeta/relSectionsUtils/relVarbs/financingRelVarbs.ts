import { loanVarbsNotInFinancing } from "../../baseSections";
import { PiCalculationName } from "../../baseSectionsUtils/baseValues/calculations/piCalculations";
import { numObj } from "../../baseSectionsUtils/baseValues/NumObj";
import { switchNames } from "../../baseSectionsUtils/RelSwitchVarb";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relCheckUpdateProps } from "../rel/relUpdateFnProps";
import { relUpdateSwitch } from "../rel/relUpdateSwitch";
import { relVarb, relVarbS } from "../rel/relVarb";
import { RelVarbs, relVarbsS } from "../relVarbs";

const loanBase = switchNames("loanBase", "dollarsPercent");
export function loanRelVarbs(): RelVarbs<"loan"> {
  return {
    ...relVarbsS.savableSection,
    [loanBase.switch]: relVarb("string", {
      initValue: "percent",
    }),
    [loanBase.percent]: relVarbS.calcVarb("Base loan", {
      initNumber: 5,
      inUpdateSwitchProps: [
        relUpdateSwitch.divideToPercent(
          loanBase.switch,
          "dollars",
          relVarbInfoS.local("loanBaseDollars"),
          relVarbInfoS.pibling("propertyGeneral", "propertyGeneral", "price", {
            expectedCount: "onlyOne",
          })
        ),
      ],
      displayNameEnd: " percent",
      endAdornment: "%",
    }),
    [loanBase.dollars]: relVarbS.calcVarb("Base loan dollars", {
      inUpdateSwitchProps: [
        relUpdateSwitch.percentToDecimalTimesBase(
          "loanBase",
          relVarbInfoS.pibling("propertyGeneral", "propertyGeneral", "price", {
            expectedCount: "onlyOne",
          })
        ),
      ],
      displayNameEnd: " dollars",
      startAdornment: "$",
    }),
    loanTotalDollars: relVarbS.sumMoney("Loan amount", [
      relVarbInfoS.local("loanBaseDollars"),
      relVarbInfoS.children("wrappedInLoanList", "total"),
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

    mortInsUpfront: relVarbS.moneyObj("Upfront mortgage insurance", {
      initNumber: 0,
    }),
    closingCosts: relVarbS.sumMoney("Closing costs", [
      relVarbInfoS.children("closingCostList", "total"),
    ]),
    wrappedInLoan: relVarbS.sumMoney("Wrapped into loan", [
      relVarbInfoS.children("wrappedInLoanList", "total"),
    ]),
    piCalculationName: relVarb("string", {
      initValue: "piFixedStandard" as PiCalculationName,
    }),
    ...relVarbsS.ongoingPureCalc(
      "principalAndInterest",
      "Loan payments",
      {
        monthly: {
          updateFnName: "piMonthly",
          updateFnProps: relCheckUpdateProps.piMonthly(
            relVarbInfosS.localByVarbName([
              "piCalculationName",
              "loanTotalDollars",
              "loanTermMonths",
              "interestRatePercentMonthly",
              "interestRatePercentYearly",
            ])
          ),
        },
        yearly: {
          updateFnName: "piYearly",
          updateFnProps: relCheckUpdateProps.piYearly(
            relVarbInfosS.localByVarbName([
              "piCalculationName",
              "loanTotalDollars",
              "loanTermYears",
              "interestRatePercentYearly",
            ])
          ),
        },
      },
      { shared: { startAdornment: "$", unit: "money" } }
    ),
  };
}

export const financingRelVarbs: RelVarbs<"financing"> = {
  downPaymentDollars: relVarbS.leftRightPropFn(
    "Down payment",
    "simpleSubtract",
    [
      relVarbInfoS.stepSibling("propertyGeneral", "propertyGeneral", "price"),
      relVarbInfoS.local("loanBaseDollars"),
    ],
    { startAdornment: "$", displayNameEnd: " dollars" }
    // this should respond to propertyGeneral's price change and be 0
    // but it's not.
  ),
  downPaymentPercent: relVarbS.leftRightPropFn(
    "Down payment",
    "divideToPercent",
    [
      relVarbInfoS.local("downPaymentDollars"),
      relVarbInfoS.stepSibling("propertyGeneral", "propertyGeneral", "price"),
    ],
    { endAdornment: "%", displayNameEnd: "percent" }
  ),
  ...relVarbsS.ongoingSumNums(
    "piti",
    "PITI payments",
    [
      ...relVarbInfosS.local(["principalAndInterest", "mortgageIns"]),
      relVarbInfoS.stepSibling("propertyGeneral", "propertyGeneral", "taxes"),
      relVarbInfoS.stepSibling("propertyGeneral", "propertyGeneral", "homeIns"),
    ],
    { shared: { startAdornment: "$" }, switchInit: "monthly" }
  ),
  ...relVarbsS.sumSection("loan", loanRelVarbs(), loanVarbsNotInFinancing),
  ...relVarbsS.sectionStrings("loan", loanRelVarbs(), loanVarbsNotInFinancing),
};
