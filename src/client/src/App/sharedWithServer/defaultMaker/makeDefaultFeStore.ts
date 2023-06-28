import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import { timeS } from "../utils/timeS";
import { makeDefaultDealPack } from "./makeDefaultDeal";
import { makeDefaultOutputSection } from "./makeDefaultOutputSection";

export function makeDefaultFeUserPack(): SectionPack<"feStore"> {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");
  feStore.updateValues({
    email: "",
    userName: "Guest",
    labSubscription: "basicPlan",
    labSubscriptionExp: timeS.hundredsOfYearsFromNow,
    authStatus: "guest",
    userDataStatus: "notLoaded",
  });
  feStore.addChild("outputSection", {
    sectionPack: makeDefaultOutputSection(),
  });
  feStore.addChild("dealMain", {
    sectionPack: makeDefaultDealPack(),
  });

  return feStore.makeSectionPack();
}
