import { AuthStatus } from "../SectionsMeta/baseSectionsVarbsValues";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import {
  AnalyzerPlan,
  UserDataStatus,
} from "../SectionsMeta/values/StateValue/unionValues";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { timeS } from "../utils/date";

export function makeDefaultFeUserPack(): SectionPack<"feUser"> {
  const analyzerPlan: AnalyzerPlan = "basicPlan";
  const authStatus: AuthStatus = "guest";
  const userDataStatus: UserDataStatus = "notLoaded";
  const feUser = PackBuilderSection.initAsOmniChild("feUser", {
    dbVarbs: {
      email: "",
      userName: "Guest",
      analyzerPlan,
      analyzerPlanExp: timeS.hundredsOfYearsFromNow,
      authStatus,
      userDataStatus,
    },
  });
  return feUser.makeSectionPack();
}
