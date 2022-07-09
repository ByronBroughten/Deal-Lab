import { loanVarbsNotInFinancing } from "../../baseSections";
import { numObj } from "../../baseSectionsUtils/baseValues/NumObj";
import { switchNames } from "../../baseSectionsUtils/switchNames";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { rel } from "../rel";
import { RelVarbs, relVarbsS } from "../relVarbs";

const loanAmountBase = switchNames("loanAmountBase", "dollarsPercent");
export function loanRelVarbs<R extends RelVarbs<"loan">>(): R {
  return {
    ...relVarbsS.savableSection,
    [loanAmountBase.switch]: rel.varb.string({
      initValue: "percent",
    }),
    [loanAmountBase.percent]: rel.varb.calcVarb("Base loan amount", {
      initNumber: 5,
      inUpdateSwitchProps: [
        rel.updateSwitch.divideToPercent(
          loanAmountBase.switch,
          "dollars",
          relVarbInfoS.local("loanAmountBaseDollars"),
          relVarbInfoS.pibling("propertyGeneral", "propertyGeneral", "price", {
            expectedCount: "onlyOne",
          })
        ),
      ],
      endAdornment: "%",
    }),
    [loanAmountBase.dollars]: rel.varb.calcVarb("Base loan amount", {
      inUpdateSwitchProps: [
        rel.updateSwitch.percentToDecimalTimesBase(
          "loanAmountBase",
          relVarbInfoS.pibling("propertyGeneral", "propertyGeneral", "price", {
            expectedCount: "onlyOne",
          })
        ),
      ],
      startAdornment: "$",
    }),
    loanAmountDollarsTotal: rel.varb.sumMoney("Loan amount", [
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

    mortInsUpfront: rel.varb.moneyObj("Upfront mortgage insurance", {
      initNumber: 0,
    }),
    closingCosts: rel.varb.sumMoney("Closing costs", [
      relVarbInfoS.children("closingCostList", "total"),
    ]),
    wrappedInLoan: rel.varb.sumMoney("Wrapped into loan", [
      relVarbInfoS.children("wrappedInLoanList", "total"),
    ]),

    ...relVarbsS.ongoingPureCalc(
      "pi",
      "Principal plus interest payments",
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
  } as R;
}

export const financingRelVarbs: RelVarbs<"financing"> = {
  downPaymentDollars: rel.varb.leftRightPropFn(
    "Down payment",
    "simpleSubtract",
    [
      relVarbInfoS.stepSibling("propertyGeneral", "propertyGeneral", "price"),
      relVarbInfoS.local("loanAmountBaseDollars"),
    ],
    { startAdornment: "$" }
    // this should respond to propertyGeneral's price change and be 0
    // but it's not.
  ),
  downPaymentPercent: rel.varb.leftRightPropFn(
    "Down payment",
    "divideToPercent",
    [
      relVarbInfoS.local("downPaymentDollars"),
      relVarbInfoS.stepSibling("propertyGeneral", "propertyGeneral", "price"),
    ],
    { endAdornment: "%" }
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
