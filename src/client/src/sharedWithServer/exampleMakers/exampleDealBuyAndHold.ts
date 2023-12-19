import { SectionPack } from "../SectionPack/SectionPack";
import { TopOperator } from "../TopOperator";
import { makeDefaultDealPack } from "../defaultMaker/makeDefaultDeal";
import { numObj } from "../sectionVarbsConfig/StateValue/NumObj";
import { numObjNext } from "../sectionVarbsConfig/StateValue/numObjNext";
import { timeS } from "../utils/timeS";
import { example20PercentDownFinancing } from "./example20PercentDownLoan";
import { exampleDealMgmt } from "./makeExampleMgmt";
import { avgHomeAdvisorNahbCapExProps } from "./makeExamplePeriodicListProps";
import { makeExampleProperty } from "./makeExampleProperty";

export function exampleDealBuyAndHold(displayName: string) {
  const topOperator = TopOperator.initWithDefaultActiveDealAndSolve();
  const deal = topOperator.prepper.getActiveDeal();
  deal.loadSelfSectionPack(makeDefaultDealPack("buyAndHold"));
  const now = timeS.now();
  deal.updateValues({
    dateTimeFirstSaved: now,
    dateTimeLastSaved: now,
  });

  const property = deal.onlyChild("property");
  property.loadSelfSectionPack(exampleDealBuyAndHoldProperty());

  example20PercentDownFinancing(deal, "purchaseFinancing");

  const mgmt = deal.onlyChild("mgmtOngoing");
  mgmt.loadSelfSectionPack(exampleDealMgmt);

  deal.updateValues({
    displayNameEditor: displayName,
    displayNameSource: "displayNameEditor",
  });

  topOperator.solve();
  return deal.get.makeSectionPack();
}

function exampleDealBuyAndHoldProperty(): SectionPack<"property"> {
  return makeExampleProperty({
    dealMode: "buyAndHold",
    property: {
      streetAddress: "479 Example Lane",
      city: "Minneapolis",
      state: "MN",
      zipCode: "55411",
      displayName: "",
      purchasePrice: numObj(230000),
      sqft: numObj(2500),
    },
    taxesOngoingYearly: numObj(2500),
    homeInsOngoingYearly: numObjNext("1000+(", ["numUnits"], "*200)"),
    unit: [
      {
        numBedrooms: numObj(3),
        rentMonthly: numObj(1800),
      },
      {
        numBedrooms: numObj(3),
        rentMonthly: numObj(1800),
      },
    ],
    repairValue: [
      ["Replace toilet", 200],
      ["Replace locks", 150],
      ["Repair oven", 200],
      ["New flooring", numObjNext("3*", ["sqft"])],
      ["Replace faucet", 100],
    ],
    costOverrunValue: { valuePercent: numObj(0) },
    utilityOngoing: [
      ["Water", numObjNext("60*", ["numUnits"])],
      ["Garbage", numObjNext("50*", ["numUnits"])],
    ],
    capExValue: {
      valueSourceName: "listTotal",
      items: avgHomeAdvisorNahbCapExProps,
    },
    maintenanceValue: {
      valueSourceName: "onePercentArvAndSqft",
    },
  });
}
