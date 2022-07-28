import { SectionPack } from "../SectionPack/SectionPack";
import { feStoreTableNames } from "../SectionsMeta/relChildSections";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import {
  makeDefaultSubscriptionInfo,
  makeDefaultUser,
} from "./makeDefaultUser";
import { makeDefaultFeStoreTables } from "./makeMainTablePackMakers";

export function makeDefaultFeStorePack(): SectionPack<"feStore"> {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");
  feStore.loadChild({
    childName: "user",
    sectionPack: makeDefaultUser(),
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
