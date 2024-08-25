import { ChildPackArrs } from "../../SectionPacks/ChildSectionPack";
import { SectionPack } from "../../SectionPacks/SectionPack";
import { dbStoreNames } from "../../stateSchemas/derivedFromChildrenSchemas/DbStoreName";
import { numObj } from "../../stateSchemas/StateValue/NumObj";
import { stringObj } from "../../stateSchemas/StateValue/StringObj";
import { timeS } from "../../utils/timeS";
import { makeDefaultDealCompareMenu } from "../defaultMaker/makeDefaultDealCompareMenu";
import { makeDefaultOutputList } from "../defaultMaker/makeDefaultOutputList";
import { makeDefaultOutputSection } from "../defaultMaker/makeDefaultOutputSection";
import { PackBuilderSection } from "../Packers/PackBuilderSection";
import { makeHomeAdvisorNahbCapExList } from "./makeExampleCapEx";
import { makeExampleDeal } from "./makeExampleDeal";
import { makeExampleLoan } from "./makeExampleLoan";
import { makeExampleMgmt } from "./makeExampleMgmt";
import {
  avgHomeAdvisorNahbCapExProps,
  examplePropertyRepairProps,
  examplePropertyUtilityProps,
} from "./makeExamplePeriodicListProps";
import { makeNationalUtilityAverageList } from "./makeExamplePeriodicLists";
import { makeExampleProperty } from "./makeExampleProperty";
import { makeExampleUserVarbLists } from "./makeExampleUserVarbLists";

export type DbStoreSeed = {
  authId: string;
  email: string;
  userName: string;
  timeJoined: number;
};

export function initDefaultDbStoreBuilder({
  authId,
  userName,
  email,
  timeJoined,
}: DbStoreSeed): PackBuilderSection<"dbStore"> {
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
    sectionPack: makeDefaultDealCompareMenu(),
  });
  dbStore.addChild("outputSection", {
    sectionPack: makeDefaultOutputSection(),
  });
  dbStore.loadChildren({
    childName: "outputListMain",
    sectionPacks: [
      makeDefaultOutputList("homeBuyer"),
      makeDefaultOutputList("buyAndHold"),
      makeDefaultOutputList("fixAndFlip"),
      makeDefaultOutputList("brrrr"),
    ],
  });
  return dbStore;
}
export function initTestDbStoreArrs(seed: DbStoreSeed) {
  return initDefaultDbStoreBuilder(seed).makeChildPackArrs(...dbStoreNames);
}

export function initProdDbStoreArrs(
  seed: DbStoreSeed
): ChildPackArrs<"dbStore"> {
  const dbStore = initDefaultDbStoreBuilder(seed);
  dbStore.loadChildren({
    childName: "numVarbListMain",
    sectionPacks: makeExampleUserVarbLists(),
  });
  dbStore.addChild("dealMain", {
    sectionPack: makeExampleDeal("homeBuyer", "Homebuyer Example"),
  });
  dbStore.addChild("utilitiesListMain", {
    sectionPack: makeNationalUtilityAverageList(),
  });
  dbStore.addChild("capExListMain", {
    sectionPack: makeHomeAdvisorNahbCapExList(),
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
      displayName: stringObj("National Average 2023"),
      interestRatePercentYearly: numObj(7.58),
      loanTermYears: numObj(30),
      hasMortgageIns: true,
    },
    baseLoan: { valueSourceName: "purchaseLoanValue" },
    closingCosts: { valueSourceName: "fivePercentLoan" },
    purchaseLoanValue: { offPercentEditor: numObj(14) },
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
      items: avgHomeAdvisorNahbCapExProps,
    },
    maintenanceValue: { valueSourceName: "onePercentArvAndSqft" },
  });
}
