import { NumObj } from "./baseSections/baseValues/NumObj";
import { rel } from "./rel";
import { relSection } from "./rel/relSection";

function propertyRelVarbs<R extends RelVarbs<"property">>(): R {
  const r: any = {
    title: rel.varb.string("Title"),
    price: rel.varb.moneyObj("Price"),
    sqft: rel.varb.entityEditor("Square feet"),
    ...rel.varbs.timeMoney("taxes", "Taxes", "property", {
      switchInit: "yearly",
    }),
    ...rel.varbs.timeMoney("homeIns", "Home insurance", "property", {
      switchInit: "yearly",
    }),
    numUnits: rel.varb.sumNums("Unit count", [
      rel.varbInfo.children("unit", "one"),
    ]),
    numBedrooms: rel.varb.sumNums("Bedroom count", [
      rel.varbInfo.children("unit", "numBedrooms"),
    ]),
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
  };
  return r;
}

export const prePropertyGeneral = {
  ...relSection.base(
    "propertyGeneral",
    "Property",
    {
      ...rel.varbs.sumSection("property", propertyRelVarbs()),
      ...rel.varbs.sectionStrings("property", propertyRelVarbs(), ["title"]),
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
  ...relSection.base("property", "Property", propertyRelVarbs(), {
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
    propertyRelVarbs(),
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
      initValue: NumObj.init(1),
    }),
    numBedrooms: rel.varb.entityEditor("BRs"),
    ...rel.varbs.timeMoney("targetRent", "Rent", "unit"),
  }),
} as const;
