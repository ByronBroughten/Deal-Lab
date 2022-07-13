import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relVarbS } from "../rel/relVarb";
import { RelVarbs, relVarbsS } from "../relVarbs";

export function propertyRelVarbs<R extends RelVarbs<"property">>(): R {
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
    // upfront

    // these
    upfrontExpenses: relVarbS.sumMoney("Upfront expenses", [
      relVarbInfoS.children("upfrontCostList", "total"),
    ]),
    upfrontRevenue: relVarbS.sumMoney("Upfront revenues", [
      relVarbInfoS.children("upfrontRevenueList", "total"),
    ]),
    // ongoing
    ...relVarbsS.ongoingSumNums(
      "ongoingExpenses",
      "Ongoing property expenses",
      [relVarbInfoS.children("ongoingCostList", "total")],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),

    // ongoing revenue
    ...relVarbsS.ongoingSumNums(
      "targetRent",
      "Total rent",
      [relVarbInfoS.children("unit", "targetRent")],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
    ...relVarbsS.ongoingSumNums(
      "miscOngoingRevenue",
      "Revenue besides rent",
      [relVarbInfoS.children("ongoingRevenueList", "total")],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
    ...relVarbsS.ongoingSumNums(
      "ongoingRevenue",
      "Ongoing property revenue",
      relVarbInfosS.local(["targetRent", "miscOngoingRevenue"]),
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
  } as R;
}
