import { StrictOmit } from "../../utils/types";
import { ContextName, loanVarbsNotInFinancing } from "../baseSections";
import { switchNames } from "../baseSections/switchNames";
import { rel } from "./rel";
import { relSection, RelSectionOptions } from "./rel/relSection";
import { RelVarbs } from "./rel/relVarbs";

const loanAmountBase = switchNames("loanAmountBase", "dollarsPercent");
function loanRelVarbs(): RelVarbs<ContextName, "loan"> {
  return {
    title: rel.varb.string(),
    [loanAmountBase.switch]: rel.varb.string({ initValue: "percent" }),
    [loanAmountBase.percent]: rel.varb.calcVarb("Base loan amount", {
      initNumber: 5,
      inUpdateSwitchProps: [
        rel.updateSwitch.divideToPercent(
          "loan",
          loanAmountBase.switch,
          "dollars",
          rel.varbInfo.local("loan", "loanAmountBaseDollars"),
          rel.varbInfo.static("propertyGeneral", "price")
        ),
      ],
      endAdornment: "%",
    }),
    [loanAmountBase.dollars]: rel.varb.calcVarb("Base loan amount", {
      inUpdateSwitchProps: [
        rel.updateSwitch.percentToDecimalTimesBase(
          "loan",
          "loanAmountBase",
          rel.varbInfo.static("propertyGeneral", "price")
        ),
      ],
      startAdornment: "$",
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
      shared: { initNumber: 0 },
    }),

    mortInsUpfront: rel.varb.moneyObj("Upfront mortgage insurance", {
      initNumber: 0,
    }),
    closingCosts: rel.varb.sumMoney("Closing costs", [
      rel.varbInfo.children("closingCostList", "total"),
    ]),
    wrappedInLoan: rel.varb.sumMoney("Wrapped into loan", [
      rel.varbInfo.children("wrappedInLoanList", "total"),
    ]),
    ...rel.varbs.ongoingPureCalc(
      "pi",
      "Principal plus interest payments",
      {
        monthly: {
          updateFnName: "piMonthly",
          updateFnProps: {
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
        },
        yearly: {
          updateFnName: "piYearly",
          updateFnProps: {
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
          },
        },
      },
      { shared: { startAdornment: "$" } }
    ),
  } as RelVarbs<ContextName, "loan">;
}

function loanSection<
  SN extends "loan" | "loanIndexNext",
  O extends StrictOmit<
    RelSectionOptions<"fe", "loan">,
    "childNames" | "relVarbs"
  > = {}
>(sectionName: SN, options?: O) {
  return relSection.base(
    "fe" as ContextName,
    sectionName,
    "Loan",
    loanRelVarbs() as RelVarbs<"fe", SN>,
    {
      ...((options ?? {}) as O),
      childNames: ["closingCostList", "wrappedInLoanList"] as const,
    }
  );
}

const financingRelVarbs: RelVarbs<ContextName, "financing"> = {
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
  ...rel.varbs.sumSection("loan", loanRelVarbs(), loanVarbsNotInFinancing),
  ...rel.varbs.sectionStrings("loan", loanRelVarbs(), ["title"]),
};

export const relFinancing = {
  ...relSection.base(
    "fe" as ContextName,
    "financing",
    "Financing",
    financingRelVarbs,
    {
      childNames: ["loan", "loanDefault"] as const,
    }
  ),
  ...loanSection("loan", {
    defaultStoreName: "loanDefault",
    rowIndexName: "loanIndexNext",
    arrStoreName: "loan",
  } as const),
  ...loanSection("loanIndexNext"),
  ...relSection.base(
    "fe" as ContextName,
    "loanDefault",
    "Default Loan",
    loanRelVarbs(),
    { childNames: ["closingCostList", "wrappedInLoanList"] as const }
  ),
  ...rel.section.singleTimeList("closingCostList", "Closing Costs", {
    fullIndexName: "userSingleList",
  }),
  ...rel.section.singleTimeList("wrappedInLoanList", "Items Wrapped in Loan", {
    fullIndexName: "userSingleList",
  }),
};
