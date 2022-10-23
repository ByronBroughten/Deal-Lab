import {
  AnalyzerPlan,
  AuthStatus,
  UserDataStatus,
} from "../SectionsMeta/baseSectionsVarbs";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { feStoreNameS } from "../SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { timeS } from "../utils/date";
import { getDefaultMainTableMakers } from "./getDefaultMainTableMakers";
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
  for (const storeName of feStoreNameS.arrs.displayStoreName) {
    const displayStore = feUser.addAndGetChild(storeName);
    displayStore.addChild("displayNameList");
  }

  const defaultTableMakers = getDefaultMainTableMakers();
  for (const tableName of feStoreNameS.arrs.mainTableName) {
    feUser.loadChild({
      childName: tableName,
      sectionPack: defaultTableMakers[tableName](),
    });
  }
  return feUser.makeSectionPack();
}
