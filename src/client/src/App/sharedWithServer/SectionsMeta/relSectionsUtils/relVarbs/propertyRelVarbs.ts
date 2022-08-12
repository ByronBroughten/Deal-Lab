import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relVarbS } from "../rel/relVarb";
import { RelVarbs, relVarbsS } from "../relVarbs";

export function propertyRelVarbs(): RelVarbs<"property"> {
  return {
    ...relVarbsS.savableSection,
    price: relVarbS.moneyObj("Price"),
    sqft: relVarbS.calcVarb("Square feet"),
    ...relVarbsS.timeMoneyInput("taxes", "Taxes", {
      switchInit: "yearly",
    }),
    ...relVarbsS.timeMoneyInput("homeIns", "Home insurance", {
      switchInit: "yearly",
    }),
    numUnits: relVarbS.sumChildVarb("Unit count", "unit", "one"),
    numBedrooms: relVarbS.sumChildVarb("Bedroom count", "unit", "numBedrooms"),

    upfrontExpenses: relVarbS.sumMoney("Upfront expenses", [
      relVarbInfoS.children("upfrontCostList", "total"),
    ]),
    upfrontRevenue: relVarbS.sumMoney("Upfront revenues", [
      relVarbInfoS.children("upfrontRevenueList", "total"),
    ]),
    ...relVarbsS.ongoingSumNums(
      "expenses",
      "Ongoing expenses",
      [
        relVarbInfoS.children("ongoingCostList", "total"),
        relVarbInfoS.local("taxes"),
        relVarbInfoS.local("homeIns"),
      ],
      {
        switchInit: "monthly",
        shared: { startAdornment: "$" },
      }
    ),

    // ongoing revenue
    ...relVarbsS.ongoingSumNums(
      "targetRent",
      "Total rent",
      [relVarbInfoS.children("unit", "targetRent")],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
    ...relVarbsS.ongoingSumNums(
      "miscRevenue",
      "Revenue besides rent",
      [relVarbInfoS.children("ongoingRevenueList", "total")],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
    ...relVarbsS.ongoingSumNums(
      "revenue",
      "Property revenue",
      relVarbInfosS.local(["targetRent", "miscRevenue"]),
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
  };
}
