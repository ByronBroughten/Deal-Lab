import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultUser() {
  const user = PackBuilderSection.initAsOmniChild("user", {
    dbVarbs: {
      email: "",
      userName: "Guest",
    },
  });
  return user.makeSectionPack();
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
