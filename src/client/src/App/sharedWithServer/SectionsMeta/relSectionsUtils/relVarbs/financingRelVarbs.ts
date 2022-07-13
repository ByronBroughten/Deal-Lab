import { loanVarbsNotInFinancing } from "../../baseSections";
import { numObj } from "../../baseSectionsUtils/baseValues/NumObj";
import { switchNames } from "../../baseSectionsUtils/RelSwitchVarb";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relUpdateSwitch } from "../rel/relUpdateSwitch";
import { relVarb, relVarbS } from "../rel/relVarb";
import { RelVarbs, relVarbsS } from "../relVarbs";

const loanAmountBase = switchNames("loanAmountBase", "dollarsPercent");
export function loanRelVarbs(): RelVarbs<"loan"> {
  return {
    ...relVarbsS.savableSection,
    [loanAmountBase.switch]: relVarb("string", {
      initValue: "percent",
    }),
    [loanAmountBase.percent]: relVarbS.calcVarb("Base loan", {
      initNumber: 5,
      inUpdateSwitchProps: [
        relUpdateSwitch.divideToPercent(
          loanAmountBase.switch,
          "dollars",
          relVarbInfoS.local("loanAmountBaseDollars"),
          relVarbInfoS.pibling("propertyGeneral", "propertyGeneral", "price", {
            expectedCount: "onlyOne",
          })
        ),
      ],
      displayNameEnd: " percent",
      endAdornment: "%",
    }),
    [loanAmountBase.dollars]: relVarbS.calcVarb("Base loan dollars", {
      inUpdateSwitchProps: [
        relUpdateSwitch.percentToDecimalTimesBase(
          "loanAmountBase",
          relVarbInfoS.pibling("propertyGeneral", "propertyGeneral", "price", {
            expectedCount: "onlyOne",
          })
        ),
      ],
      displayNameEnd: " dollars",
      startAdornment: "$",
    }),
    loanAmountDollarsTotal: relVarbS.sumMoney("Loan amount", [
      relVarbInfoS.local("loanAmountBaseDollars"),
      relVarbInfoS.children("wrappedInLoanList", "total"),
    ]),
    ...relVarbsS.ongoingInput("interestRatePercent", "Interest rate", {
      switchInit: "yearly",
      yearly: {
        initValue: numObj(3),
        endAdornment: "% annual",
      },
      monthly: { endAdornment: "% monthly" },
    }),
    ...relVarbsS.monthsYearsInput("loanTerm", "Loan term", {
      switchInit: "years",
      years: {
        initValue: numObj(30),
      },
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

    ...relVarbsS.ongoingPureCalc(
      "pi",
      "Principal + interest",
      {
        monthly: {
          updateFnName: "piMonthly",
          updateFnProps: {
            loanAmountDollarsTotal: relVarbInfoS.local(
              "loanAmountDollarsTotal"
            ),
            loanTermMonths: relVarbInfoS.local("loanTermMonths"),
            interestRatePercentMonthly: relVarbInfoS.local(
              "interestRatePercentMonthly"
            ),
          },
        },
        yearly: {
          updateFnName: "piYearly",
          updateFnProps: {
            loanAmountDollarsTotal: relVarbInfoS.local(
              "loanAmountDollarsTotal"
            ),
            loanTermYears: relVarbInfoS.local("loanTermYears"),
            interestRatePercentYearly: relVarbInfoS.local(
              "interestRatePercentYearly"
            ),
          },
        },
      },
      { shared: { startAdornment: "$" } }
    ),
  };
}

export const financingRelVarbs: RelVarbs<"financing"> = {
  downPaymentDollars: relVarbS.leftRightPropFn(
    "Down payment",
    "simpleSubtract",
    [
      relVarbInfoS.stepSibling("propertyGeneral", "propertyGeneral", "price"),
      relVarbInfoS.local("loanAmountBaseDollars"),
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
      ...relVarbInfosS.local(["pi", "mortgageIns"]),
      relVarbInfoS.stepSibling("propertyGeneral", "propertyGeneral", "taxes"),
      relVarbInfoS.stepSibling("propertyGeneral", "propertyGeneral", "homeIns"),
    ],
    { shared: { startAdornment: "$" }, switchInit: "monthly" }
  ),
  ...relVarbsS.sumSection("loan", loanRelVarbs(), loanVarbsNotInFinancing),
  ...relVarbsS.sectionStrings("loan", loanRelVarbs(), ["title"]),
};
