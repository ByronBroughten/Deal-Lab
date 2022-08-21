import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { feStoreTableNames } from "../SectionsMeta/relChildSections";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import {
  makeDefaultAuthInfo,
  makeDefaultPublicUserInfo,
  makeDefaultSubscriptionInfo,
} from "./makeDefaultPublicUserInfo";
import { makeDefaultFeStoreTables } from "./makeMainTablePackMakers";

export function makeDefaultFeStorePack(): SectionPack<"feUser"> {
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
  const defaultTablePacks = makeDefaultFeStoreTables();
  for (const tableName of feStoreTableNames) {
    feUser.loadChild({
      childName: tableName,
      sectionPack: defaultTablePacks[tableName](),
    });
  }
  return feUser.makeSectionPack();
}
