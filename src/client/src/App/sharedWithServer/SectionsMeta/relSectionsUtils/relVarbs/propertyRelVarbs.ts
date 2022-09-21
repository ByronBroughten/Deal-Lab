import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relVarbS } from "../rel/relVarb";
import { RelVarbs, relVarbsS } from "../relVarbs";

export function propertyRelVarbs(): RelVarbs<"property"> {
  return {
    ...relVarbsS._typeUniformity,
    ...relVarbsS.savableSection,
    price: relVarbS.moneyObj("Price"),
    sqft: relVarbS.calcVarb("Square feet"),
    ...relVarbsS.timeMoneyInput("taxes", "Taxes", {
      switchInit: "yearly",
    }),
    ...relVarbsS.timeMoneyInput("homeIns", "Home insurance", {
      switchInit: "yearly",
    }),
    // zipcode: relVarbS.numObj("Zipcode"),
    numUnits: relVarbS.sumChildVarb("Unit count", "unit", "one"),
    numBedrooms: relVarbS.sumChildVarb("Bedroom count", "unit", "numBedrooms"),

    upfrontExpenses: relVarbS.sumMoney("Upfront expenses", [
      relVarbInfoS.children("upfrontCostListGroup", "total"),
    ]),
    upfrontRevenue: relVarbS.sumMoney("Upfront revenues", [
      relVarbInfoS.children("upfrontRevenueListGroup", "total"),
    ]),
    ...relVarbsS.ongoingSumNums(
      "expenses",
      "Ongoing expenses",
      [
        relVarbInfoS.children("ongoingCostListGroup", "total"),
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
      "miscRevenue",
      "Revenue besides rent",
      [relVarbInfoS.children("ongoingRevenueListGroup", "total")],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
    ...relVarbsS.ongoingSumNums(
      "targetRent",
      "Total rent",
      [relVarbInfoS.children("unit", "targetRent")],
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
