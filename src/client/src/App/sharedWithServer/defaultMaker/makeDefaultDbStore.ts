import { dbStoreNames } from "../SectionsMeta/sectionChildrenDerived/DbStoreName";
import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { timeS } from "../utils/timeS";
import { makeDefaultDealCompareMenu } from "./makeDefaultDealCompareMenu";
import { exampleDealBuyAndHold } from "./makeDefaultFeUser/exampleDealBuyAndHold";
import { exampleDealHomebuyer } from "./makeDefaultFeUser/exampleDealHomebuyer";
import { makeExampleCapExList } from "./makeDefaultFeUser/makeExampleCapEx";
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

  dbStore.loadChild({
    childName: "dealCompareMainMenu",
    sectionPack: makeDefaultDealCompareMenu(),
  });

  dbStore.loadChild({
    childName: "outputSection",
    sectionPack: makeDefaultOutputSection(),
  });

  dbStore.loadChildren({
    childName: "numVarbListMain",
    sectionPacks: makeExampleUserVarbLists(),
  });
  // dbStore.loadChildren({
  //   childName: "onetimeListMain",
  //   sectionPacks: makeExampleUserOneTimeLists(),
  // });
  // dbStore.loadChildren({
  //   childName: "ongoingListMain",
  //   sectionPacks: makeExampleUserOngoingLists(),
  // });
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

  dbStore.loadChildren({
    childName: "propertyMain",
    sectionPacks: [makeExampleStoreProperty()],
  });
  return dbStore.makeChildPackArrs(...dbStoreNames);
}

function makeExampleStoreProperty() {
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
