import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { timeS } from "../utils/date";

export function makeDefaultFeUserPack(): SectionPack<"feUser"> {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  feUser.updateValues({
    email: "",
    userName: "Guest",
    labSubscription: "basicPlan",
    labSubscriptionExp: timeS.hundredsOfYearsFromNow,
    authStatus: "guest",
    userDataStatus: "notLoaded",
  });

  return feUser.makeSectionPack();
}
