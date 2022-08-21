import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import {
  feStoreTableNames,
  feUserNameListNames,
} from "../SectionsMeta/relChildSections";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultFeUserTables } from "./makeDefaultFeUserTables";
import {
  makeDefaultAuthInfo,
  makeDefaultPublicUserInfo,
  makeDefaultSubscriptionInfo,
} from "./makeDefaultPublicUserInfo";

export function makeDefaultFeUserPack(): SectionPack<"feUser"> {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  feUser.loadChild({
    childName: "userInfo",
    sectionPack: makeDefaultPublicUserInfo(),
  });
  feUser.loadChild({
    childName: "authInfo",
    sectionPack: makeDefaultAuthInfo(),
  });
  feUser.loadChild({
    childName: "subscriptionInfo",
    sectionPack: makeDefaultSubscriptionInfo(),
  });

  for (const listName of feUserNameListNames) {
    feUser.addChild(listName);
  }

  const defaultTablePacks = makeDefaultFeUserTables();
  for (const tableName of feStoreTableNames) {
    feUser.loadChild({
      childName: tableName,
      sectionPack: defaultTablePacks[tableName](),
    });
  }
  return feUser.makeSectionPack();
}
