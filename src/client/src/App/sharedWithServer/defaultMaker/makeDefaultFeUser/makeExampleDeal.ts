import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { numObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { numObjNext } from "../../SectionsMeta/values/StateValue/numObjNext";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";
import { timeS } from "../../utils/timeS";
import { makeDefaultDealPack } from "../makeDefaultDeal";
import { makeExampleLoan } from "./makeExampleLoan";
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

  const financing = deal.onlyChild("financing");
  financing.updateValues({ financingMode: "useLoan" });

  const loan = financing.onlyChild("loan");
  loan.loadSelf(exampleDealLoan());

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
  purchasePrice: numObj(230000),
  sqft: numObj(2500),
  taxesYearly: numObj(2500),
  homeInsYearly: numObjNext("1000+(", ["numUnits"], "*200)"),
} as const;

function exampleDealLoan(): SectionPack<"loan"> {
  return makeExampleLoan({
    loan: {
      displayName: stringObj("Conventional 20% Down"),
      interestRatePercentOngoingEditor: numObj(6),
      loanTermSpanEditor: numObj(30),
      hasMortgageIns: false,
      loanAmountInputMode: "loanAmount",
    },
    baseLoan: {
      valueSourceName: "purchaseLoanValue",
    },
    purchaseLoanValue: {
      offPercentEditor: numObj(20),
    },
    closingCosts: {
      valueSourceName: "valueEditor",
      valueDollarsEditor: numObj(6000),
    },
  });
}

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
      numUnitsEditor: numObj(2),
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
