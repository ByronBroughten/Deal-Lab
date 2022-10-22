import {
  AuthStatus,
  UserDataStatus,
  UserPlan,
} from "../SectionsMeta/baseSectionsVarbs";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { timeS } from "../utils/date";

export function makeDefaultFeUserInfo() {
  const analyzerPlan: UserPlan = "basicPlan";
  const authStatus: AuthStatus = "guest";
  const userDataStatus: UserDataStatus = "notLoaded";
  const userInfoNext = PackBuilderSection.initAsOmniChild("feUserInfo", {
    dbVarbs: {
      email: "",
      userName: "Guest",
      analyzerPlan,
      analyzerPlanExp: timeS.hundredsOfYearsFromNow,
      authStatus,
      userDataStatus,
    },
  });
  return userInfoNext.makeSectionPack();
}
