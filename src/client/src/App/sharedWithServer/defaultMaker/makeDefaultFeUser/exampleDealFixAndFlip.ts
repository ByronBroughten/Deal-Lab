import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { numObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { numObjNext } from "../../SectionsMeta/values/StateValue/numObjNext";
import { makeExampleProperty } from "./makeExampleProperty";

export function exampleDealFixAndFlipProperty(): SectionPack<"property"> {
  return makeExampleProperty({
    dealMode: "fixAndFlip",
    property: {
      streetAddress: "987 Example Drive",
      city: "Atlanta",
      state: "GA",
      zipCode: "30310",
      displayName: "",
      purchasePrice: numObj(230000),
      sqft: numObj(2500),
      numUnitsEditor: numObj(2),
      afterRepairValueEditor: numObj(320000),
      holdingPeriodMonths: numObj(4),
    },
    taxesHoldingYearly: numObj(2500),
    homeInsHoldingYearly: numObjNext("1000+(", ["numUnits"], "*200)"),
    repairValue: [
      ["Replace toilet", 200],
      ["Replace locks", 150],
      ["Repair oven", 200],
      ["New flooring", numObjNext("3*", ["sqft"])],
      ["Replace faucet", 100],
      ["Revamp kitchen", 20000],
      ["Finish basement", 20000],
      ["Add bedroom", 15000],
    ],
    costOverrunValue: { valuePercent: numObj(0) },
    utilityHolding: [
      ["Water", 75],
      ["Garbage", numObjNext("50*", ["numUnits"])],
    ],
    sellingCostValue: {
      valueSourceName: "sixPercent",
    },
  });
}
