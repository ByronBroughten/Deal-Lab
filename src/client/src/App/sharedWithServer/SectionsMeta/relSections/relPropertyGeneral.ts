import { rel } from "./rel";
import { relChild, relChildren } from "./rel/relChild";
import { relSection } from "./rel/relSection";
import { RelVarbs } from "./rel/relVarbs";

function makePropertyRelVarbs<R extends RelVarbs<"property">>(): R {
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

    // these
    upfrontExpenses: rel.varb.sumMoney("Upfront expenses", [
      rel.varbInfo.children("singleTimeList", "total"),
    ]),
    upfrontRevenue: rel.varb.sumMoney("Upfront revenues", [
      rel.varbInfo.children("singleTimeList", "total"),
    ]),
    // ongoing
    ...rel.varbs.ongoingSumNums(
      "ongoingExpenses",
      "Ongoing property expenses",
      [rel.varbInfo.children("ongoingList", "total")],
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
      [rel.varbInfo.children("ongoingList", "total")],
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
  propertyGeneral: relSection(
    "Property",
    {
      ...rel.varbs.sumSection("property", makePropertyRelVarbs()),
      ...rel.varbs.sectionStrings("property", makePropertyRelVarbs(), [
        "title",
      ]),
    },
    {
      children: { property: relChild("property") },
    }
  ),
  property: relSection("Property", makePropertyRelVarbs(), {
    children: relChildren({
      upfrontCostList: ["singleTimeList"],
      upfrontRevenueList: ["singleTimeList"],
      ongoingCostList: ["ongoingList"],
      ongoingRevenueList: ["ongoingList"],
      unit: ["unit"],
    }),
    tableStoreName: "propertyTableStore",
    rowIndexName: "property",
  }),
  unit: relSection("Unit", {
    one: rel.varb.numObj("Unit", {
      updateFnName: "one",
      initNumber: 1,
    }),
    numBedrooms: rel.varb.calcVarb("BRs"),
    ...rel.varbs.timeMoney("targetRent", "Rent", "unit"),
  } as RelVarbs<"unit">),
} as const;
