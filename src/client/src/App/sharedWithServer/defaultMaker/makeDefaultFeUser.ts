import {
  AnalyzerPlan,
  UserDataStatus,
} from "../SectionsMeta/baseSectionsVarbs";
import { AuthStatus } from "../SectionsMeta/baseSectionsVarbsValues";
import { feStoreNameS } from "../SectionsMeta/relSectionsDerived/FeStoreName";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { timeS } from "../utils/date";
import { getDefaultMainTableMakers } from "./getDefaultMainTableMakers";
import { makeExampleProperty } from "./makeDefaultFeUser/makeExampleProperty";
import { makeExampleUserOngoingLists } from "./makeDefaultFeUser/makeExampleUserOngoingLists";
import { makeExampleUserSingleTimeLists } from "./makeDefaultFeUser/makeExampleUserSingleTimeLists";
import { makeExampleUserVarbLists } from "./makeDefaultFeUser/makeExampleUserVarbLists";

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
  feUser.loadChildren({
    childName: "userVarbListMain",
    sectionPacks: makeExampleUserVarbLists(),
  });
  feUser.loadChildren({
    childName: "ongoingListMain",
    sectionPacks: makeExampleUserOngoingLists(),
  });
  feUser.loadChildren({
    childName: "singleTimeListMain",
    sectionPacks: makeExampleUserSingleTimeLists(),
  });
  const defaultTableMakers = getDefaultMainTableMakers();
  for (const tableName of feStoreNameS.arrs.mainTableName) {
    feUser.loadChild({
      childName: tableName,
      sectionPack: defaultTableMakers[tableName](),
    });
  }

  feUser.loadChildren({
    childName: "propertyMain",
    sectionPacks: [makeExampleProperty()],
  });

  return feUser.makeSectionPack();
}
