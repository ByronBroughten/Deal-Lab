import { dbStoreNames } from "../SectionsMeta/sectionChildrenDerived/DbStoreName";
import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { timeS } from "../utils/timeS";
import { makeExampleDeal } from "./makeDefaultFeUser/makeExampleDeal";
import {
  examplePropertyCapExListProps,
  examplePropertyRepairProps,
  examplePropertyUtilityProps,
} from "./makeDefaultFeUser/makeExampleOngoingListsProps";
import { makeExampleProperty } from "./makeDefaultFeUser/makeExampleProperty";
import {
  makeExampleUserOneTimeLists,
  makeExampleUserOngoingLists,
} from "./makeDefaultFeUser/makeExampleUserOngoingLists";
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
    childName: "outputSection",
    sectionPack: makeDefaultOutputSection(),
  });

  dbStore.loadChildren({
    childName: "numVarbListMain",
    sectionPacks: makeExampleUserVarbLists(),
  });
  dbStore.loadChildren({
    childName: "onetimeListMain",
    sectionPacks: makeExampleUserOneTimeLists(),
  });
  dbStore.loadChildren({
    childName: "ongoingListMain",
    sectionPacks: makeExampleUserOngoingLists(),
  });
  dbStore.loadChildren({
    childName: "dealMain",
    sectionPacks: [makeExampleDeal("Example Deal")],
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
      taxesYearly: numObj(2800),
      homeInsYearly: numObj(1800),
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
    repairValue: examplePropertyRepairProps,
    costOverrunValue: { valuePercent: numObj(0) },
    utilityValue: examplePropertyUtilityProps,
    capExValue: {
      valueSourceName: "listTotal",
      items: examplePropertyCapExListProps,
    },
    maintenanceValue: { valueSourceName: "onePercentAndSqft" },
  });
}
