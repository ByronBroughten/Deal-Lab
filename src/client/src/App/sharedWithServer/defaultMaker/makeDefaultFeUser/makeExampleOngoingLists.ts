import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import {
  numObj,
  NumObj,
  numToObj,
} from "../../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";

type UtilityItemProp = [string, number | NumObj];
export function makeUtilityList(itemPropArr: UtilityItemProp[], dbId?: string) {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");

  const valueSource = "valueEditor";
  const utilityList = feStore.addAndGetChild("ongoingListMain", {
    dbId,
    sectionValues: {
      itemValueSource: valueSource,
      itemPeriodicSwitch: "monthly",
      totalPeriodicSwitch: "monthly",
      displayName: stringObj("Utility Examples"),
    },
  });
  for (const itemProps of itemPropArr) {
    utilityList.addChild("ongoingItem", {
      sectionValues: {
        displayNameEditor: itemProps[0],
        valuePeriodicSwitch: "monthly",
        valueSourceName: valueSource,
        valuePeriodicEditor: numToObj(itemProps[1]),
      },
    });
  }
  return utilityList.makeSectionPack();
}

type OneTimeItemProp = readonly [string, number | NumObj];
export function makeExampleOneTimeList(
  listTitle: string,
  itemPropArr: readonly OneTimeItemProp[],
  dbId?: string
): SectionPack<"onetimeList"> {
  const list = PackBuilderSection.initAsOmniChild("onetimeList");
  list.updateValues({ displayName: stringObj(listTitle) });
  dbId && list.updater.updateDbId(dbId);

  for (const itemProps of itemPropArr) {
    const value = itemProps[1];
    list.addChild("singleTimeItem", {
      sectionValues: {
        displayNameEditor: itemProps[0],
        valueEditor: typeof value === "number" ? numObj(value) : value,
      },
    });
  }
  return list.makeSectionPack();
}

// displayName, lifespan, replacementCost... last two should swap
type CapExItemProp = readonly [string, number | NumObj, number | NumObj];
export function makeCapExList(
  itemPropArr: readonly CapExItemProp[],
  dbId?: string
): SectionPack<"capExList"> {
  const feStore = PackBuilderSection.initAsOmniChild("feStore");
  const itemPeriodicSwitch = "yearly";
  const capExList = feStore.addAndGetChild("capExListMain", {
    dbId,
    sectionValues: {
      itemPeriodicSwitch,
      totalPeriodicSwitch: "yearly",
    },
  });
  for (const itemProps of itemPropArr) {
    capExList.addChild("capExItem", {
      sectionValues: {
        displayNameEditor: itemProps[0],
        valuePeriodicSwitch: itemPeriodicSwitch,
        lifespanSpanEditor: numToObj(itemProps[1]),
        lifespanSpanSwitch: "years",
        costToReplace: numToObj(itemProps[2]),
      },
    });
  }
  return capExList.makeSectionPack();
}
