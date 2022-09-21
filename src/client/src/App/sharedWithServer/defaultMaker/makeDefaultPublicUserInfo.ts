import { AuthStatus, UserPlan } from "../SectionsMeta/baseSectionsVarbs";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { timeS } from "../utils/date";

export function makeDefaultPublicUserInfo() {
  const userInfo = PackBuilderSection.initAsOmniChild("userInfo", {
    dbVarbs: {
      email: "",
      userName: "Guest",
    },
  });
  return userInfo.makeSectionPack();
}

export function makeDefaultSubscriptionInfo() {
  const plan: UserPlan = "basicPlan";
  const subscriptionInfo = PackBuilderSection.initAsOmniChild(
    "subscriptionInfo",
    { dbVarbs: { plan, planExp: timeS.hundredsOfYearsFromNow } }
  );
  return subscriptionInfo.makeSectionPack();
}

export function makeDefaultAuthInfo() {
  const authStatus: AuthStatus = "guest";
  const authInfo = PackBuilderSection.initAsOmniChild("authInfo", {
    dbVarbs: { authStatus },
  });
  return authInfo.makeSectionPack();
}
