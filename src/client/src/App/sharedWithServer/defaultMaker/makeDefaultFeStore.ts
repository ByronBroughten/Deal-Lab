import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { feStoreTableNames } from "../SectionsMeta/relChildSections";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import {
  makeDefaultPublicUserInfo,
  makeDefaultSubscriptionInfo,
} from "./makeDefaultPublicUserInfo";
import { makeDefaultFeStoreTables } from "./makeMainTablePackMakers";

export function makeDefaultFeStorePack(): SectionPack<"feStore"> {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");
  feStore.loadChild({
    childName: "publicUserInfo",
    sectionPack: makeDefaultPublicUserInfo(),
  });
  feStore.loadChild({
    childName: "subscriptionInfo",
    sectionPack: makeDefaultSubscriptionInfo(),
  });
  const defaultTablePacks = makeDefaultFeStoreTables();
  for (const tableName of feStoreTableNames) {
    feStore.loadChild({
      childName: tableName,
      sectionPack: defaultTablePacks[tableName](),
    });
  }
  return feStore.makeSectionPack();
}
