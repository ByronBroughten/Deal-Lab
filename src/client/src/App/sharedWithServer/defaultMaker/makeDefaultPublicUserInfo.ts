import { AuthStatus, UserPlan } from "../SectionsMeta/baseSections";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultPublicUserInfo() {
  const userInfo = PackBuilderSection.initAsOmniChild("publicUserInfo", {
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
    { dbVarbs: { plan, planExp: 0 } }
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
