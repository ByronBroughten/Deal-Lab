import { rel } from "./rel";
import { relSection } from "./rel/relSection";
import { RelVarbs } from "./rel/relVarbs";

function propertyPreVarbs<R extends RelVarbs<"property">>(): R {
  const r: R = {
    title: rel.varb.string(),
    price: rel.varb.moneyObj("Price"),
    sqft: rel.varb.calcVarb("Square feet"),
    ...rel.varbs.timeMoney("taxes", "Taxes", "property", {
      switchInit: "yearly",
    }),
    ...rel.varbs.timeMoney("homeIns", "Home insurance", "property", {
      switchInit: "yearly",
    }),
    numUnits: rel.varb.sumChildVarb("Unit count", "unit", "one"),
    numBedrooms: rel.varb.sumChildVarb("Bedroom count", "unit", "numBedrooms"),
    // upfront
    upfrontExpenses: rel.varb.sumMoney("Upfront expenses", [
      rel.varbInfo.children("upfrontCostList", "total"),
    ]),
    upfrontRevenue: rel.varb.sumMoney("Upfront revenues", [
      rel.varbInfo.children("upfrontRevenueList", "total"),
    ]),
    // ongoing
    ...rel.varbs.ongoingSumNums(
      "ongoingExpenses",
      "Ongoing property expenses",
      [rel.varbInfo.children("ongoingCostList", "total")],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),

    // ongoing revenue
    ...rel.varbs.ongoingSumNums(
      "targetRent",
      "Total rent",
      [rel.varbInfo.children("unit", "targetRent")],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
    ...rel.varbs.ongoingSumNums(
      "miscOngoingRevenue",
      "Revenue besides rent",
      [rel.varbInfo.children("ongoingRevenueList", "total")],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
    ...rel.varbs.ongoingSumNums(
      "ongoingRevenue",
      "Ongoing property revenue",
      rel.varbInfo.locals("property", ["targetRent", "miscOngoingRevenue"]),
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
  } as R;
  return r;
}

export const prePropertyGeneral = {
  ...relSection.base(
    "propertyGeneral",
    "Property",
    {
      ...rel.varbs.sumSection("property", propertyPreVarbs()),
      ...rel.varbs.sectionStrings("property", propertyPreVarbs(), ["title"]),
    },
    {
      parent: "main",
      childSectionNames: [
        "property",
        "propertyIndex",
        "propertyDefault",
        "propertyTable",
      ] as const,
    }
  ),
  ...relSection.base("property", "Property", propertyPreVarbs(), {
    defaultStoreName: "propertyDefault",
    indexStoreName: "propertyIndex",
    childSectionNames: [
      "upfrontCostList",
      "upfrontRevenueList",
      "ongoingCostList",
      "ongoingRevenueList",
      "unit",
    ] as const,
  }),
  ...relSection.base(
    "propertyDefault",
    "Default Property",
    propertyPreVarbs(),
    {
      parent: "propertyGeneral",
      childSectionNames: [
        "upfrontCostList",
        "upfrontRevenueList",
        "ongoingCostList",
        "ongoingRevenueList",
        "unit",
      ] as const,
    }
  ),
  ...rel.section.rowIndex("propertyIndex", "Property Index"),
  ...rel.section.managerTable(
    "propertyTable",
    "Property Table",
    "propertyIndex"
  ),
  ...relSection.base("unit", "Unit", {
    one: rel.varb.numObj("Unit", {
      updateFnName: "one",
      initNumber: 1,
    }),
    numBedrooms: rel.varb.calcVarb("BRs"),
    ...rel.varbs.timeMoney("targetRent", "Rent", "unit"),
  } as RelVarbs<"unit">),
} as const;
