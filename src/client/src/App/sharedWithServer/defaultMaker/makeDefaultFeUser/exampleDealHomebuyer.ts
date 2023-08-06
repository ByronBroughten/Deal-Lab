import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { numObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { numObjNext } from "../../SectionsMeta/values/StateValue/numObjNext";
import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";
import { timeS } from "../../utils/timeS";
import { makeDefaultDealPack } from "../makeDefaultDeal";
import { example20PercentDownFinancing } from "./example20PercentDownLoan";
import { avgHomeAdvisorNahbCapExProps } from "./makeExampleOngoingListsProps";
import { makeExampleProperty } from "./makeExampleProperty";

export function exampleDealHomebuyer(displayName: string): SectionPack<"deal"> {
  const deal = PackBuilderSection.initAsOmniChild("deal");
  deal.overwriteSelf(makeDefaultDealPack("homeBuyer"));
  const now = timeS.now();
  deal.updateValues({
    dateTimeFirstSaved: now,
    dateTimeLastSaved: now,
  });

  const property = deal.onlyChild("property");
  property.overwriteSelf(exampleHomebuyerProperty());

  example20PercentDownFinancing(deal, "purchaseFinancing");

  deal.updateValues({
    displayNameEditor: displayName,
    displayNameSource: "displayNameEditor",
  });
  return deal.makeSectionPack();
}

function exampleHomebuyerProperty(): SectionPack<"property"> {
  return makeExampleProperty({
    dealMode: "homeBuyer",
    property: {
      streetAddress: "479 Example Lane",
      city: "Minneapolis",
      state: "MN",
      zipCode: "55411",
      displayName: "",
      likability: numObj(8),
      numBedroomsEditor: numObj(3),
      purchasePrice: numObj(230000),
      sqft: numObj(2500),
    },
    taxesOngoingYearly: numObj(2500),
    homeInsOngoingYearly: numObj(1200),
    repairValue: [
      ["Replace toilet", 200],
      ["Replace locks", 150],
      ["Repair oven", 200],
      ["New flooring", numObjNext("3*", ["sqft"])],
      ["Replace faucet", 100],
    ],
    costOverrunValue: { valuePercent: numObj(0) },
    utilityOngoing: [
      ["Water", numObj(60)],
      ["Garbage", numObj(50)],
    ],
    capExValue: {
      valueSourceName: "listTotal",
      items: avgHomeAdvisorNahbCapExProps,
    },
    maintenanceValue: { valueSourceName: "onePercentArv" },
  });
}
