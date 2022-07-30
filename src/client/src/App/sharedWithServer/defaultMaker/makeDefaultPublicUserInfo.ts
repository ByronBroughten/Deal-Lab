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
  const subscriptionInfo = PackBuilderSection.initAsOmniChild(
    "subscriptionInfo",
    {
      dbVarbs: {
        plan: "guestPlan",
        planExp: 0,
      },
    }
  );
  return subscriptionInfo.makeSectionPack();
}
