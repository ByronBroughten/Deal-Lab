import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { numObj, NumObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";

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

type CapExItemProp = readonly [string, NumObj, NumObj];
export function makeCapExList(
  itemPropArr: readonly CapExItemProp[],
  dbId?: string
): SectionPack<"capExList"> {
  const feUser = PackBuilderSection.initAsOmniChild("feUser");
  const itemOngoingSwitch = "yearly";
  const capExList = feUser.addAndGetChild("capExListMain", {
    dbId,
    dbVarbs: {
      itemOngoingSwitch,
      totalOngoingSwitch: "yearly",
    },
  });
  for (const itemProps of itemPropArr) {
    capExList.addChild("capExItem", {
      dbVarbs: {
        displayNameEditor: itemProps[0],
        valueOngoingSwitch: itemOngoingSwitch,
        lifespanSpanEditor: itemProps[1],
        lifespanSpanSwitch: "years",
        costToReplace: itemProps[2],
      },
    });
  }
  return capExList.makeSectionPack();
}
