import { dbStoreNames } from "../SectionsMeta/sectionChildrenDerived/DbStoreName";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { timeS } from "../utils/timeS";
import { makeDefaultDealCompareCache } from "./makeDefaultDealCompareCache";
import { exampleDealBuyAndHold } from "./makeDefaultFeUser/exampleDealBuyAndHold";
import { exampleDealHomebuyer } from "./makeDefaultFeUser/exampleDealHomebuyer";
import { makeExampleCapExList } from "./makeDefaultFeUser/makeExampleCapEx";
import { makeExampleLoan } from "./makeDefaultFeUser/makeExampleLoan";
import { makeExampleMgmt } from "./makeDefaultFeUser/makeExampleMgmt";
import {
  exampleAdvancedCapExProps,
  examplePropertyCapExListProps,
  examplePropertyRepairProps,
  examplePropertyUtilityProps,
  exampleSimpleCapExProps,
} from "./makeDefaultFeUser/makeExampleOngoingListsProps";
import { makeExampleProperty } from "./makeDefaultFeUser/makeExampleProperty";
import { makeExampleUserVarbLists } from "./makeDefaultFeUser/makeExampleUserVarbLists";
import { makeDefaultOutputSection } from "./makeDefaultOutputSection";

export type DbStoreSeed = {
  authId: string;
  email: string;
  userName: string;
  timeJoined: number;
};

export function makeDefaultDbStoreArrs({
  authId,
  userName,
  email,
  timeJoined,
}: DbStoreSeed) {
  const dbStore = PackBuilderSection.initAsOmniChild("dbStore");
  const userInfo = dbStore.addAndGetChild("userInfo");
  userInfo.updateValues({
    userName,
    email,
    timeJoined,
  });
  const userInfoPrivate = dbStore.addAndGetChild("userInfoPrivate");
  userInfoPrivate.updateValues({ guestSectionsAreLoaded: false });

  const authInfoPrivate = dbStore.addAndGetChild("authInfoPrivate");
  authInfoPrivate.updateValues({ authId });

  const stripeInfoPrivate = dbStore.addAndGetChild("stripeInfoPrivate");
  stripeInfoPrivate.updateValues({ customerId: "" });

  dbStore.addChild("dealCompareMenu", {
    sectionPack: makeDefaultDealCompareCache(),
  });

  dbStore.addChild("outputSection", {
    sectionPack: makeDefaultOutputSection(),
  });

  dbStore.loadChildren({
    childName: "numVarbListMain",
    sectionPacks: makeExampleUserVarbLists(),
  });
  dbStore.loadChildren({
    childName: "dealMain",
    sectionPacks: [
      exampleDealHomebuyer("Homebuyer Deal Example"),
      exampleDealBuyAndHold("Rental Property Deal Example"),
    ],
  });
  dbStore.loadChildren({
    childName: "capExListMain",
    sectionPacks: [
      makeExampleCapExList(
        "Simple CapEx Example",
        exampleSimpleCapExProps,
        timeS.now()
      ),
      makeExampleCapExList(
        "Advanced CapEx Example",
        exampleAdvancedCapExProps,
        timeS.now()
      ),
    ],
  });
  dbStore.addChild("propertyMain", { sectionPack: makeExampleStoreProperty() });
  dbStore.addChild("loanMain", { sectionPack: makeExampleStoreLoan() });
  dbStore.addChild("mgmtMain", { sectionPack: makeExampleStoreMgmt() });

  return dbStore.makeChildPackArrs(...dbStoreNames);
}

function makeExampleStoreMgmt() {
  return makeExampleMgmt({
    mgmt: { displayName: stringObj("Owner managed") },
    basePay: { valueSourceName: "none" },
    vacancyLoss: { valueSourceName: "fivePercentRent" },
  });
}

function makeExampleStoreLoan(): SectionPack<"loan"> {
  return makeExampleLoan({
    loan: {
      displayName: stringObj("30Y Fifteen Percent Down"),
      interestRatePercentPeriodicEditor: numObj(6),
      loanTermSpanEditor: numObj(30),
      hasMortgageIns: false,
    },
    baseLoan: { valueSourceName: "purchaseLoanValue" },
    closingCosts: { valueSourceName: "fivePercentLoan" },
    purchaseLoanValue: { offPercentEditor: numObj(15) },
  });
}

function makeExampleStoreProperty(): SectionPack<"property"> {
  return makeExampleProperty({
    dealMode: "buyAndHold",
    property: {
      streetAddress: "123 Example Ave",
      city: "Atlanta",
      state: "GA",
      zipCode: "30303",
      displayName: "Example Property",
      purchasePrice: numObj(250000),
      sqft: numObj(2500),
      dateTimeFirstSaved: timeS.now(),
    },
    unit: [
      {
        numBedrooms: numObj(4),
        rentMonthly: numObj(2300),
      },
      {
        numBedrooms: numObj(2),
        rentMonthly: numObj(1400),
      },
    ],
    taxesOngoingYearly: numObj(2800),
    homeInsOngoingYearly: numObj(1800),
    utilityOngoing: examplePropertyUtilityProps,
    repairValue: examplePropertyRepairProps,
    costOverrunValue: { valuePercent: numObj(0) },
    capExValue: {
      valueSourceName: "listTotal",
      items: examplePropertyCapExListProps,
    },
    maintenanceValue: { valueSourceName: "onePercentAndSqft" },
  });
}
