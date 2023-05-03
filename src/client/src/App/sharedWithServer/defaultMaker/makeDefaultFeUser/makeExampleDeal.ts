import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { numObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { numObjNext } from "../../SectionsMeta/values/StateValue/numObjNext";
import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";
import { timeS } from "../../utils/timeS";
import { makeDefaultDealPack } from "../makeDefaultDeal";
import { dealExampleLoan } from "./makeExampleLoan";
import { exampleDealMgmt } from "./makeExampleMgmt";
import { makeExampleProperty } from "./makeExampleProperty";

export function makeExampleDeal(displayName: string) {
  const deal = PackBuilderSection.initAsOmniChild("deal");
  deal.loadSelf(makeDefaultDealPack("buyAndHold"));
  const now = timeS.now();
  deal.updateValues({
    dateTimeFirstSaved: now,
    dateTimeLastSaved: now,
  });

  const property = deal.onlyChild("property");
  property.loadSelf(exampleDealBuyAndHoldProperty());

  const fixAndFlip = deal.onlyChild("fixAndFlipProperty");
  fixAndFlip.loadSelf(exampleDealFixAndFlipProperty());

  const financing = deal.onlyChild("financing");
  const loan = financing.onlyChild("loan");
  loan.loadSelf(dealExampleLoan);

  financing.updateValues({
    financingMode: "useLoan",
    displayName: loan.get.valueNext("displayName"),
  });

  const mgmt = deal.onlyChild("mgmt");
  mgmt.loadSelf(exampleDealMgmt);

  deal.updateValues({
    displayNameEditor: displayName,
    displayNameSource: "displayNameEditor",
  });
  return deal.makeSectionPack();
}

const examplePropertyCommon = {
  streetAddress: "123 Example Ave",
  city: "Chicago",
  state: "IL",
  zipCode: "60614",
  displayName: "",
  purchasePrice: numObj(250000),
  sqft: numObj(2500),
  taxesYearly: numObj(2500),
  homeInsYearly: numObjNext("1000+(", ["numUnits"], "*200)"),
} as const;

function exampleDealBuyAndHoldProperty(): SectionPack<"property"> {
  return makeExampleProperty({
    dealMode: "buyAndHold",
    property: examplePropertyCommon,
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
    utilityValue: [
      ["Water", numObjNext("60*", ["numUnits"])],
      ["Garbage", numObjNext("50*", ["numUnits"])],
    ],
    capExValue: {
      valueSourceName: "fivePercentRent",
      items: [],
    },
    maintenanceValue: {
      valueSourceName: "onePercentAndSqft",
    },
  });
}

export function exampleDealFixAndFlipProperty(): SectionPack<"property"> {
  return makeExampleProperty({
    dealMode: "fixAndFlip",
    property: {
      ...examplePropertyCommon,
      afterRepairValue: numObj(320000),
      holdingPeriodMonths: numObj(4),
    },
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
    utilityValue: [
      ["Water", 75],
      ["Garbage", numObjNext("50*", ["numUnits"])],
    ],
    sellingCostValue: {
      valueSourceName: "sixPercent",
    },
  });
}
