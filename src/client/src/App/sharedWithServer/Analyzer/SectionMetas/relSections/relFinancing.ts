import { rel } from "./rel";
import { relSection } from "./rel/relSection";
import { RelVarbs } from "./rel/relVarbs";
import { switchVarbNames } from "./baseSections/baseSwitch";
import { loanVarbsNotInFinancing } from "./baseSections";
import { NumObj } from "./baseSections/baseValues/NumObj";

const loanAmountBase = switchVarbNames("loanAmountBase", "dollarsPercent");
function loanPreVarbs(): RelVarbs<"loan"> {
  return {
    title: rel.varb.string("Title"),
    [loanAmountBase.switch]: rel.varb.string({ initValue: "percent" }),
    [loanAmountBase.percent]: rel.varb.calcVarb("Base loan amount", {
      initValue: NumObj.init(5),
      inUpdateProps: [
        rel.updateSwitch.divideToPercent(
          "loan",
          loanAmountBase.switch,
          "dollars",
          rel.varbInfo.local("loan", "loanAmountBaseDollars"),
          rel.varbInfo.static("propertyGeneral", "price")
        ),
      ],
    }),
    [loanAmountBase.dollars]: rel.varb.calcVarb("Base loan amount", {
      inUpdateProps: [
        rel.updateSwitch.percentToDecimalTimesBase(
          "loan",
          "loanAmountBase",
          rel.varbInfo.static("propertyGeneral", "price")
        ),
      ],
    }),
    loanAmountDollarsTotal: rel.varb.sumMoney("Loan amount", [
      rel.varbInfo.local("loan", "loanAmountBaseDollars"),
      rel.varbInfo.children("wrappedInLoanList", "total"),
    ]),
    ...rel.varbs.ongoingInput("interestRatePercent", "Interest rate", "loan", {
      switchInit: "yearly",
      yearly: {
        initValue: rel.value.numObj(3),
        endAdornment: "% annual",
      },
      monthly: { endAdornment: "% monthly" },
    }),
    ...rel.varbs.monthsYearsInput("loanTerm", "Loan term", "loan", {
      switchInit: "years",
      years: { initValue: rel.value.numObj(30) },
    }),
    ...rel.varbs.timeMoney("mortgageIns", "Mortgage insurance", "loan", {
      switchInit: "yearly",
      shared: { initValue: NumObj.init(0) },
    }),

    mortInsUpfront: rel.varb.moneyObj("Upfront mortgage insurance", {
      initValue: NumObj.init(0),
    }),
    closingCosts: rel.varb.sumMoney("Closing costs", [
      rel.varbInfo.children("closingCostList", "total"),
    ]),
    wrappedInLoan: rel.varb.sumMoney("Wrapped into loan", [
      rel.varbInfo.children("wrappedInLoanList", "total"),
    ]),
    ...rel.varbs.ongoing(
      "loan"
      "pi",
      {
        monthly: {
          displayName: "PI Monthly",
          updateInfoArr: [
            {
              updateName: "piMonthly"
              updateProps: {
                loanAmountDollarsTotal: rel.varbInfo.relative(
                  "loan",
                  "loanAmountDollarsTotal",
                  "local"
                ),
                loanTermMonths: rel.varbInfo.relative(
                  "loan",
                  "loanTermMonths",
                  "local"
                ),
                interestRatePercentMonthly: rel.varbInfo.relative(
                  "loan",
                  "interestRatePercentMonthly",
                  "local"
                ),
              },
            }
          ]
        },
        yearly: {
          displayName: "PI Yearly",
          updateInfoArr: [
            {
              updateName: "piYearly",
              updateProps: {
                loanAmountDollarsTotal: rel.varbInfo.relative(
                  "loan",
                  "loanAmountDollarsTotal",
                  "local"
                ),
                loanTermYears: rel.varbInfo.relative(
                  "loan",
                  "loanTermYears",
                  "local"
                ),
                interestRatePercentYearly: rel.varbInfo.relative(
                  "loan",
                  "interestRatePercentYearly",
                  "local"
                ),
              }
            }
          ]
        },
        targets: {
          startAdornment: "$"
        }
      }
    )
    

    // ...rel.varbs.ongoingPureCalc(
    //   "pi",
    //   "Principal plus interest payments",
    //   {
    //     monthly: {
    //       updateFnName: "piMonthly",
    //       updateFnProps: {
    //         loanAmountDollarsTotal: rel.varbInfo.relative(
    //           "loan",
    //           "loanAmountDollarsTotal",
    //           "local"
    //         ),
    //         loanTermMonths: rel.varbInfo.relative(
    //           "loan",
    //           "loanTermMonths",
    //           "local"
    //         ),
    //         interestRatePercentMonthly: rel.varbInfo.relative(
    //           "loan",
    //           "interestRatePercentMonthly",
    //           "local"
    //         ),
    //       },
    //     },
    //     yearly: {
    //       updateFnName: "piYearly",
    //       updateFnProps: {
    //         loanAmountDollarsTotal: rel.varbInfo.relative(
    //           "loan",
    //           "loanAmountDollarsTotal",
    //           "local"
    //         ),
    //         loanTermYears: rel.varbInfo.relative(
    //           "loan",
    //           "loanTermYears",
    //           "local"
    //         ),
    //         interestRatePercentYearly: rel.varbInfo.relative(
    //           "loan",
    //           "interestRatePercentYearly",
    //           "local"
    //         ),
    //       },
    //     },
    //   },
    //   { shared: { startAdornment: "$" } }
    // ),
  } as RelVarbs<"loan">;
}

const test = rel.varbs.ongoing(
  "loan"
  "pi",
  {
    monthly: {
      displayName: "PI Monthly",
      updateInfoArr: [
        {
          updateName: "piMonthly"
          updateProps: {
            loanAmountDollarsTotal: rel.varbInfo.relative(
              "loan",
              "loanAmountDollarsTotal",
              "local"
            ),
            loanTermMonths: rel.varbInfo.relative(
              "loan",
              "loanTermMonths",
              "local"
            ),
            interestRatePercentMonthly: rel.varbInfo.relative(
              "loan",
              "interestRatePercentMonthly",
              "local"
            ),
          },
        }
      ]
    },
    yearly: {
      displayName: "PI Yearly",
      updateInfoArr: [
        {
          updateName: "piYearly",
          updateProps: {
            loanAmountDollarsTotal: rel.varbInfo.relative(
              "loan",
              "loanAmountDollarsTotal",
              "local"
            ),
            loanTermYears: rel.varbInfo.relative(
              "loan",
              "loanTermYears",
              "local"
            ),
            interestRatePercentYearly: rel.varbInfo.relative(
              "loan",
              "interestRatePercentYearly",
              "local"
            ),
          }
        }
      ]
    },
    targets: {
      startAdornment: "$"
    }
  }
);



const financingRelVarbs: RelVarbs<"financing"> = {
  downPaymentDollars: rel.varb.leftRightPropFn(
    "Down payment",
    "simpleSubtract",
    [
      rel.varbInfo.relative("propertyGeneral", "price", "static"),
      rel.varbInfo.relative("financing", "loanAmountBaseDollars", "static"),
    ],
    { startAdornment: "$" }
  ),
  downPaymentPercent: rel.varb.leftRightPropFn(
    "Down payment",
    "divideToPercent",
    [
      rel.varbInfo.relative("financing", "downPaymentDollars", "static"),
      rel.varbInfo.relative("propertyGeneral", "price", "static"),
    ],
    { endAdornment: "%" }
  ),
  ...rel.varbs.ongoingSumNums(
    "piti",
    "PITI payments",
    rel.varbInfo.specifiers("static", [
      ["financing", "pi"],
      ["propertyGeneral", "taxes"],
      ["propertyGeneral", "homeIns"],
      ["financing", "mortgageIns"],
    ]),
    { shared: { startAdornment: "$" }, switchInit: "monthly" }
  ),
  ...rel.varbs.sumSection("loan", loanPreVarbs(), loanVarbsNotInFinancing),
  ...rel.varbs.sectionStrings("loan", loanPreVarbs(), ["title"]),
};

export const relFinancing = {
  ...relSection.base("financing", "Financing", financingRelVarbs, {
    childSectionNames: [
      "loan",
      "loanIndex",
      "loanTable",
      "loanDefault",
    ] as const,
  }),
  ...relSection.base("loan", "Loan", loanPreVarbs(), {
    childSectionNames: ["closingCostList", "wrappedInLoanList"] as const,
    indexStoreName: "loanIndex",
    defaultStoreName: "loanDefault",
  }),
  ...relSection.base("loanDefault", "Default Loan", loanPreVarbs(), {
    childSectionNames: ["closingCostList", "wrappedInLoanList"] as const,
  }),
  ...rel.section.rowIndex("loanIndex", "Loan Index"),
  ...rel.section.managerTable("loanTable", "Saved Loans", "loanIndex"),
  ...rel.section.singleTimeList("closingCostList", "Closing Costs"),
  ...rel.section.singleTimeList("wrappedInLoanList", "Items Wrapped in Loan"),
};
