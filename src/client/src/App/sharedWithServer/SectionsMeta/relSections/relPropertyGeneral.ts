import { StrictOmit } from "../../utils/types";
import { ContextName } from "../baseSections";
import { rel } from "./rel";
import { relSection, RelSectionOptions } from "./rel/relSection";
import { RelVarbs } from "./rel/relVarbs";

function propertyRelVarbs<R extends RelVarbs<ContextName, "property">>(): R {
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

function propertySection<
  SN extends "property" | "propertyIndexNext",
  O extends StrictOmit<
    RelSectionOptions<"fe", "property">,
    "childNames" | "relVarbs"
  > = {}
>(sectionName: SN, options?: O) {
  return relSection.base(
    "fe" as ContextName,
    sectionName,
    "Property",
    propertyRelVarbs() as RelVarbs<"fe", SN>,
    {
      ...((options ?? {}) as O),
      childNames: [
        "upfrontCostList",
        "upfrontRevenueList",
        "ongoingCostList",
        "ongoingRevenueList",
        "unit",
      ] as const,
    }
  );
}

export const prePropertyGeneral = {
  ...relSection.base(
    "both",
    "propertyGeneral",
    "Property",
    {
      ...rel.varbs.sumSection("property", propertyRelVarbs()),
      ...rel.varbs.sectionStrings("property", propertyRelVarbs(), ["title"]),
    },
    {
      childNames: ["property", "propertyDefault"] as const,
    }
  ),
  ...propertySection("property", {
    defaultStoreName: "propertyDefault",
    rowIndexName: "propertyIndexNext",
  } as const),
  ...propertySection("propertyIndexNext"),
  ...relSection.base(
    "both",
    "propertyDefault",
    "Default Property",
    propertyRelVarbs(),
    {
      childNames: [
        "upfrontCostList",
        "upfrontRevenueList",
        "ongoingCostList",
        "ongoingRevenueList",
        "unit",
      ] as const,
    }
  ),
  ...relSection.base("both", "unit", "Unit", {
    one: rel.varb.numObj("Unit", {
      updateFnName: "one",
      initNumber: 1,
    }),
    numBedrooms: rel.varb.calcVarb("BRs"),
    ...rel.varbs.timeMoney("targetRent", "Rent", "unit"),
  } as RelVarbs<ContextName, "unit">),
} as const;
