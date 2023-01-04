import {
  numObj,
  NumObj,
} from "../../SectionsMeta/baseSectionsVarbs/baseValues/NumObj";
import { stringObj } from "../../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";

type CapExItemProp = readonly [string, number, NumObj];
export function makeCapExList(
  itemPropArr: readonly CapExItemProp[],
  dbId?: string
): SectionPack<"ongoingList"> {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  const capExListSwitch = "labeledSpanOverCost";
  const advancedCapExList = feUser.addAndGetChild("ongoingListMain", {
    dbId,
    dbVarbs: {
      itemValueSwitch: capExListSwitch,
      itemOngoingSwitch: "yearly",
      totalOngoingSwitch: "yearly",
      displayName: stringObj("CapEx Examples"),
    },
  });
  for (const itemProps of itemPropArr) {
    advancedCapExList.addChild("ongoingItem", {
      dbVarbs: {
        displayNameEditor: itemProps[0],
        valueOngoingSwitch: "yearly",
        lifespanSpanSwitch: "years",
        valueSourceSwitch: capExListSwitch,
        lifespanYears: numObj(itemProps[1]),
        costToReplace: itemProps[2],
      },
    });
  }
  return advancedCapExList.makeSectionPack();
}

type UtilityItemProp = readonly [string, NumObj];
export function makeUtilityList(
  itemPropArr: readonly UtilityItemProp[],
  dbId?: string
) {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");

  const valueSource = "labeledEquation";
  const utilityList = feUser.addAndGetChild("ongoingListMain", {
    dbId,
    dbVarbs: {
      itemValueSwitch: valueSource,
      itemOngoingSwitch: "monthly",
      totalOngoingSwitch: "monthly",
      displayName: stringObj("Utility Examples"),
    },
  });
  for (const itemProps of itemPropArr) {
    utilityList.addChild("ongoingItem", {
      dbVarbs: {
        displayNameEditor: itemProps[0],
        valueOngoingSwitch: "monthly",
        valueSourceSwitch: valueSource,
        valueEditor: itemProps[1],
      },
    });
  }
  return utilityList.makeSectionPack();
}

type SingleTimeItemProp = readonly [string, number];
export function makeExampleSingleTimeList(
  listTitle: string,
  itemPropArr: readonly SingleTimeItemProp[],
  dbId?: string
): SectionPack<"singleTimeList"> {
  const list = PackBuilderSection.initAsOmniChild("singleTimeList");
  list.updateValues({ displayName: stringObj(listTitle) });
  dbId && list.updater.updateDbId(dbId);

  for (const itemProps of itemPropArr) {
    list.addChild("singleTimeItem", {
      dbVarbs: {
        displayNameEditor: itemProps[0],
        valueEditor: numObj(itemProps[1]),
      },
    });
  }
  return list.makeSectionPack();
}
