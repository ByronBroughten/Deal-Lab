import { relVarbS } from "../rel/relVarb";
import { updateFnPropS, updateFnPropsS } from "../rel/UpdateFnProps";
import { RelVarbs, relVarbsS } from "../relVarbs";

export function propertyRelVarbs(): RelVarbs<"property"> {
  return {
    ...relVarbsS._typeUniformity,
    ...relVarbsS.savableSection,
    price: relVarbS.moneyObj("Purchase price"),
    sqft: relVarbS.calcVarb("Square feet"),
    ...relVarbsS.timeMoneyInput("taxes", "Taxes", {
      switchInit: "yearly",
    }),
    ...relVarbsS.timeMoneyInput("homeIns", "Home insurance", {
      switchInit: "yearly",
    }),
    arv: relVarbS.moneyObj("ARV"),
    sellingCosts: relVarbS.moneyObj("ARV"),
    // this should be a percent or dollar

    ...relVarbsS.monthsYearsInput("holdingPeriod", "Holding period", {
      switchInit: "months",
    }),

    numUnits: relVarbS.sumChildVarb("Unit count", "unit", "one"),
    numBedrooms: relVarbS.sumChildVarb("Bedroom count", "unit", "numBedrooms"),
    upfrontExpenses: relVarbS.sumMoney("Upfront expenses", [
      updateFnPropS.children("upfrontCostListGroup", "total"),
      updateFnPropS.local("price"),
    ]),
    upfrontRevenue: relVarbS.sumMoney("Upfront revenues", [
      updateFnPropS.children("upfrontRevenueListGroup", "total"),
    ]),
    ...relVarbsS.ongoingSumNums(
      "expenses",
      "Ongoing expenses",
      [
        updateFnPropS.children("ongoingCostListGroup", "total"),
        updateFnPropS.local("taxes"),
        updateFnPropS.local("homeIns"),
      ],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
    // ongoing revenue
    ...relVarbsS.ongoingSumNums(
      "miscRevenue",
      "Revenue besides rent",
      [updateFnPropS.children("ongoingRevenueListGroup", "total")],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
    ...relVarbsS.ongoingSumNums(
      "targetRent",
      "Rent",
      [updateFnPropS.children("unit", "targetRent")],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
    ...relVarbsS.ongoingSumNums(
      "revenue",
      "Property revenue",
      updateFnPropsS.localArr(["targetRent", "miscRevenue"]),
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
  };
}
