import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { feStoreNameS } from "../SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { getDefaultMainTableMakers } from "./getDefaultMainTableMakers";
import { makeDefaultDealPack } from "./makeDefaultDealPack";
import { makeExampleUserOngoingLists } from "./makeDefaultFeUser/makeExampleUserOngoingLists";
import { makeExampleUserSingleTimeLists } from "./makeDefaultFeUser/makeExampleUserSingleTimeLists";
import { makeExampleUserVarbLists } from "./makeDefaultFeUser/makeExampleUserVarbLists";
import { makeDefaultFeUserInfo } from "./makeDefaultPublicUserInfo";

export function makeDefaultFeUserPack(): SectionPack<"feUser"> {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  feUser.loadChild({
    childName: "userInfoNext",
    sectionPack: makeDefaultFeUserInfo(),
  });
  feUser.loadChild({
    childName: "activeDeal",
    sectionPack: makeDefaultDealPack(),
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
