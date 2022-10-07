import { numObj } from "../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { stringObj } from "../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { feStoreNameS } from "../SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { getDefaultMainTableMakers } from "./getDefaultMainTableMakers";
import { capExValues, utilityExamples } from "./makeDefaultFeUser/exampleLists";
import {
  makeDefaultAuthInfo,
  makeDefaultPublicUserInfo,
  makeDefaultSubscriptionInfo,
} from "./makeDefaultPublicUserInfo";

export function makeDefaultFeUserPack(): SectionPack<"feUser"> {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  const capExValueSwitch = "labeledSpanOverCost";
  const capExExampleList = feUser.addAndGetChild("ongoingListMain", {
    dbVarbs: {
      defaultValueSwitch: capExValueSwitch,
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
        valueSwitch: capExValueSwitch,
        lifespanYears: numObj(values[1]),
        costToReplace: values[2],
      },
    });
  }

  const utilityValueSwitch = "labeledEquation";
  const utiltyExampleList = feUser.addAndGetChild("ongoingListMain", {
    dbVarbs: {
      defaultValueSwitch: utilityValueSwitch,
      defaultOngoingSwitch: "monthly",
      totalOngoingSwitch: "monthly",
      displayName: stringObj("Utilities Example"),
    },
  });
  for (const values of utilityExamples) {
    utiltyExampleList.addChild("ongoingItem", {
      dbVarbs: {
        displayNameEditor: values[0],
        valueOngoingSwitch: "monthly",
        valueSwitch: utilityValueSwitch,
        numObjEditor: numObj(values[1]),
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
