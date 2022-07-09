import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { rel } from "../rel";
import { RelVarbs, relVarbsS } from "../relVarbs";

export function propertyRelVarbs<R extends RelVarbs<"property">>(): R {
  return {
    ...relVarbsS.savableSection,
    price: rel.varb.moneyObj("Price"),
    sqft: rel.varb.calcVarb("Square feet"),
    ...relVarbsS.timeMoneyInput("taxes", "Taxes", {
      switchInit: "yearly",
    }),
    ...relVarbsS.timeMoneyInput("homeIns", "Home insurance", {
      switchInit: "yearly",
    }),
    numUnits: rel.varb.sumChildVarb("Unit count", "unit", "one"),
    numBedrooms: rel.varb.sumChildVarb("Bedroom count", "unit", "numBedrooms"),
    // upfront

    // these
    upfrontExpenses: rel.varb.sumMoney("Upfront expenses", [
      relVarbInfoS.children("upfrontCostList", "total"),
    ]),
    upfrontRevenue: rel.varb.sumMoney("Upfront revenues", [
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
