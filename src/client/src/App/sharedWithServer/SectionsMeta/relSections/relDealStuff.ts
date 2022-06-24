import { StrictOmit } from "../../utils/types";
import { rel } from "./rel";
import { relSection, RelSectionOptions } from "./rel/relSection";
import { LeftRightVarbInfos } from "./rel/relVarb";
import { RelVarbs } from "./rel/relVarbs";

function dealSection<
  SN extends "deal",
  O extends StrictOmit<
    RelSectionOptions<"deal">,
    "childNames" | "relVarbs"
  > = {}
>(sectionName: SN, options?: O) {
  return relSection.base(
    "both",
    sectionName,
    "Deal",
    {
      ...rel.varbs.savableSection,
      totalInvestment: rel.varb.leftRightPropFn(
        "Upfront investment",
        "simpleSubtract",
        rel.varbInfo.specifiers("local", [
          ["deal", "upfrontExpenses"],
          ["deal", "upfrontRevenue"],
        ]) as LeftRightVarbInfos,
        { startAdornment: "$" }
      ),
      cashFlowMonthly: rel.varb.leftRightPropFn(
        "Monthly cash flow",
        "simpleSubtract",
        rel.varbInfo.specifiers("local", [
          ["deal", "revenueMonthly"],
          ["deal", "expensesMonthly"],
        ]) as LeftRightVarbInfos,
        rel.adorn.moneyMonth
      ),
      cashFlowYearly: rel.varb.leftRightPropFn(
        "Annual cash flow",
        "simpleSubtract",
        rel.varbInfo.specifiers("local", [
          ["deal", "revenueYearly"],
          ["deal", "expensesYearly"],
        ]) as LeftRightVarbInfos,
        rel.adorn.moneyYear
      ),
      cashFlowOngoingSwitch: rel.varb.string({
        initValue: "yearly",
        dbInitValue: "yearly",
      }),
      roiMonthly: rel.varb.leftRightPropFn(
        "Monthly ROI",
        "divideToPercent",
        rel.varbInfo.specifiers("local", [
          ["deal", "cashFlowMonthly"],
          ["deal", "totalInvestment"],
        ]) as LeftRightVarbInfos,
        { endAdornment: "%", unit: "percent" }
      ),
      roiYearly: rel.varb.leftRightPropFn(
        "Annual ROI",
        "divideToPercent",
        rel.varbInfo.specifiers("local", [
          ["deal", "cashFlowYearly"],
          ["deal", "totalInvestment"],
        ]) as LeftRightVarbInfos,
        { endAdornment: "%", unit: "percent" }
      ),
      roiOngoingSwitch: rel.varb.string({
        initValue: "yearly",
        dbInitValue: "yearly",
      }),
      upfrontExpensesSum: rel.varb.sumNums(
        "Sum of upfront expenses",
        rel.varbInfo.specifiers("children", [
          ["propertyGeneral", "upfrontExpenses"],
          ["mgmtGeneral", "upfrontExpenses"],
          ["financing", "downPaymentDollars"],
          ["financing", "closingCosts"],
          ["financing", "mortInsUpfront"],
        ]),
        { startAdornment: "$" }
      ),
      upfrontExpenses: rel.varb.leftRightPropFn(
        "Total upfront expenses",
        "simpleSubtract",
        [
          rel.varbInfo.local("deal", "upfrontExpensesSum"),
          rel.varbInfo.children("financing", "wrappedInLoan"),
        ] as LeftRightVarbInfos,
        { startAdornment: "$" }
      ),
      upfrontRevenue: rel.varb.sumNums(
        "Upfront revenue",
        [
          rel.varbInfo.relative(
            "propertyGeneral",
            "upfrontRevenue",
            "children"
          ),
        ],
        { startAdornment: "$" }
      ),
      ...rel.varbs.ongoingSumNums(
        "expenses",
        "Ongoing expenses",
        rel.varbInfo.specifiers("children", [
          ["propertyGeneral", "ongoingExpenses"],
          ["mgmtGeneral", "ongoingExpenses"],
          ["financing", "piti"],
        ])
      ),
      ...rel.varbs.ongoingSumNums(
        "revenue",
        "Ongoing revenue",
        [rel.varbInfo.children("propertyGeneral", "ongoingRevenue")],
        { shared: { startAdornment: "$" }, switchInit: "monthly" }
      ),
    } as RelVarbs<"fe" | "db", SN>,
    {
      ...((options ?? {}) as O),
      childNames: [
        "propertyGeneral",
        "financing",
        "mgmtGeneral",
        "dealOutputList",
        "internalVarbList",
      ] as const,
    }
  );
}

export const relDealStuff = {
  ...dealSection("deal", {
    tableStoreName: "dealTableStore",
    rowIndexName: "deal",
    arrStoreName: "deal",
  } as const),
  ...relSection.base("both", "output", "Output", rel.varbs.varbInfo()),
} as const;
