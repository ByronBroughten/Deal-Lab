import { StrictOmit } from "../../utils/types";
import { ContextName, loanVarbsNotInFinancing } from "../baseSections";
import { dbNumObj } from "../baseSections/baseValues/NumObj";
import { switchNames } from "../baseSections/switchNames";
import { rel } from "./rel";
import { relSection, RelSectionOptions } from "./rel/relSection";
import { RelVarbs } from "./rel/relVarbs";

const loanAmountBase = switchNames("loanAmountBase", "dollarsPercent");
function loanRelVarbs(sectionName: "loan"): RelVarbs<ContextName, "loan"> {
  return {
    ...rel.varbs.savableSection,
    [loanAmountBase.switch]: rel.varb.string({
      initValue: "percent",
      dbInitValue: "percent",
    }),
    [loanAmountBase.percent]: rel.varb.calcVarb("Base loan amount", {
      initNumber: 5,
      inUpdateSwitchProps: [
        rel.updateSwitch.divideToPercent(
          sectionName,
          loanAmountBase.switch,
          "dollars",
          rel.varbInfo.local(sectionName, "loanAmountBaseDollars"),
          rel.varbInfo.static("propertyGeneral", "price")
        ),
      ],
      endAdornment: "%",
    }),
    [loanAmountBase.dollars]: rel.varb.calcVarb("Base loan amount", {
      inUpdateSwitchProps: [
        rel.updateSwitch.percentToDecimalTimesBase(
          sectionName,
          "loanAmountBase",
          rel.varbInfo.static("propertyGeneral", "price")
        ),
      ],
      startAdornment: "$",
    }),
    loanAmountDollarsTotal: rel.varb.sumMoney("Loan amount", [
      rel.varbInfo.local(sectionName, "loanAmountBaseDollars"),
      rel.varbInfo.children("wrappedInLoanList", "total"),
    ]),
    ...rel.varbs.ongoingInput(
      "interestRatePercent",
      "Interest rate",
      sectionName,
      {
        switchInit: "yearly",
        yearly: {
          initValue: rel.value.numObj(3),
          dbInitValue: dbNumObj(3),
          endAdornment: "% annual",
        },
        monthly: { endAdornment: "% monthly" },
      }
    ),
    ...rel.varbs.monthsYearsInput("loanTerm", "Loan term", sectionName, {
      switchInit: "years",
      years: {
        initValue: rel.value.numObj(30),
        dbInitValue: dbNumObj(30),
      },
    }),
    ...rel.varbs.timeMoney("mortgageIns", "Mortgage insurance", sectionName, {
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
              sectionName,
              "loanAmountDollarsTotal",
              "local"
            ),
            loanTermMonths: rel.varbInfo.relative(
              sectionName,
              "loanTermMonths",
              "local"
            ),
            interestRatePercentMonthly: rel.varbInfo.relative(
              sectionName,
              "interestRatePercentMonthly",
              "local"
            ),
          },
        },
        yearly: {
          updateFnName: "piYearly",
          updateFnProps: {
            loanAmountDollarsTotal: rel.varbInfo.relative(
              sectionName,
              "loanAmountDollarsTotal",
              "local"
            ),
            loanTermYears: rel.varbInfo.relative(
              sectionName,
              "loanTermYears",
              "local"
            ),
            interestRatePercentYearly: rel.varbInfo.relative(
              sectionName,
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
  SN extends "loan",
  O extends StrictOmit<
    RelSectionOptions<"fe", "loan">,
    "childNames" | "relVarbs"
  > = {}
>(sectionName: SN, options?: O) {
  return relSection.base(
    "fe" as ContextName,
    sectionName,
    "Loan",
    loanRelVarbs(sectionName) as RelVarbs<"fe", SN>,
    {
      ...((options ?? {}) as O),
      childNames: [
        "closingCostList",
        "wrappedInLoanList",
        "internalVarbList",
      ] as const,
    }
  );
}

const financingRelVarbs: RelVarbs<ContextName, "financing"> = {
  downPaymentDollars: rel.varb.leftRightPropFn(
    "Down payment",
    "simpleSubtract",
    [
      rel.varbInfo.relative("propertyGeneral", "price", "static"),
      rel.varbInfo.relative("financing", "loanAmountBaseDollars", "local"),
    ],
    { startAdornment: "$" }
    // this should respond to propertyGeneral's price change and be 0
    // but it's not.
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
  ...rel.varbs.sumSection(
    "loan",
    loanRelVarbs("loan"),
    loanVarbsNotInFinancing
  ),
  ...rel.varbs.sectionStrings("loan", loanRelVarbs("loan"), ["title"]),
};

export const relFinancing = {
  ...relSection.base(
    "fe" as ContextName,
    "financing",
    "Financing",
    financingRelVarbs,
    {
      childNames: ["loan"] as const,
    }
  ),
  ...loanSection("loan", {
    tableStoreName: "loanTableStore",
    rowIndexName: "loan",
  } as const),
  ...rel.section.singleTimeList("closingCostList", "Closing Costs", {
    fullIndexName: "userSingleList",
  }),
  ...rel.section.singleTimeList("wrappedInLoanList", "Items Wrapped in Loan", {
    fullIndexName: "userSingleList",
  }),
};
