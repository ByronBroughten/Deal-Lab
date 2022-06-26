import { rel } from "./rel";
import { relSection } from "./rel/relSection";
import { RelVarbs } from "./rel/relVarbs";

function propertyRelVarbs<R extends RelVarbs<"property">>(): R {
  const sectionName = "property";
  return {
    ...rel.varbs.savableSection,
    price: rel.varb.moneyObj("Price"),
    sqft: rel.varb.calcVarb("Square feet"),
    ...rel.varbs.timeMoney("taxes", "Taxes", sectionName, {
      switchInit: "yearly",
    }),
    ...rel.varbs.timeMoney("homeIns", "Home insurance", sectionName, {
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
      rel.varbInfo.locals(sectionName, ["targetRent", "miscOngoingRevenue"]),
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
  } as R;
}

export const relPropertyGeneral = {
  ...relSection.base(
    "propertyGeneral",
    "Property",
    {
      ...rel.varbs.sumSection("property", propertyRelVarbs()),
      ...rel.varbs.sectionStrings("property", propertyRelVarbs(), ["title"]),
    },
    { children: { property: { sectionName: "property" } } }
  ),
  ...relSection.base("property", "Property", propertyRelVarbs(), {
    children: {
      upfrontCostList: { sectionName: "upfrontCostList" },
      upfrontRevenueList: { sectionName: "upfrontRevenueList" },
      ongoingCostList: { sectionName: "ongoingCostList" },
      ongoingRevenueList: { sectionName: "ongoingRevenueList" },
      unit: { sectionName: "unit" },
      varbList: { sectionName: "varbList" },
    },
    tableStoreName: "propertyTableStore",
    rowIndexName: "property",
  }),
  ...relSection.base("unit", "Unit", {
    one: rel.varb.numObj("Unit", {
      updateFnName: "one",
      initNumber: 1,
    }),
    numBedrooms: rel.varb.calcVarb("BRs"),
    ...rel.varbs.timeMoney("targetRent", "Rent", "unit"),
  } as RelVarbs<"unit">),
} as const;
