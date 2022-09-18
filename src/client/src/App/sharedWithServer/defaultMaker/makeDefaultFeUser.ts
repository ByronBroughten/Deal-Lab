import { numObj } from "../SectionsMeta/baseSectionsUtils/baseValues/NumObj";
import { stringObj } from "../SectionsMeta/baseSectionsUtils/baseValues/StringObj";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import {
  feStoreTableNames,
  feUserNameListNames,
} from "../SectionsMeta/relChildSections";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { capExValues } from "./makeDefaultFeUser/exampleLists";
import { makeDefaultFeUserTables } from "./makeDefaultFeUserTables";
import {
  makeDefaultAuthInfo,
  makeDefaultPublicUserInfo,
  makeDefaultSubscriptionInfo,
} from "./makeDefaultPublicUserInfo";

export function makeDefaultFeUserPack(): SectionPack<"feUser"> {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  const capExExampleList = feUser.addAndGetChild("ongoingListMain", {
    dbVarbs: {
      defaultOngoingSwitch: "yearly",
      totalOngoingSwitch: "yearly",
      displayName: stringObj("CapEx Example"),
    },
  });
  for (const values of capExValues) {
    capExExampleList.addChild("ongoingItem", {
      dbVarbs: {
        displayNameEditor: values[0],
        valueOngoingSwitch: "yearly",
        lifespanSpanSwitch: "years",
        lifespanYears: numObj(values[1]),
        costToReplace: values[2],
      },
    });
  }

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

  const defaultTableMakers = makeDefaultFeUserTables();
  for (const tableName of feStoreTableNames) {
    feUser.loadChild({
      childName: tableName,
      sectionPack: defaultTableMakers[tableName](),
    });
  }
  return feUser.makeSectionPack();
}
