import { stringObj } from "../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultSingleTimeValue } from "./makeDefaultSingleTimeValue";

export const propertyDefaultChildMakers = {
  upfrontExpenseGroup(): SectionPack<"singleTimeValueGroup"> {
    const listGroup = PackBuilderSection.initAsOmniChild(
      "singleTimeValueGroup"
    );
    listGroup.addChild("singleTimeList", {
      dbVarbs: { displayName: stringObj("Repairs") },
    });

    const value = listGroup.loadAndGetChild({
      childName: "singleTimeValue",
      sectionPack: makeDefaultSingleTimeValue(),
    });
    value.updateValues({
      displayNameEditor: stringObj("Repairs"),
    });
    return listGroup.makeSectionPack();
  },
  ongoingCostListGroup(): SectionPack<"ongoingListGroup"> {
    const listGroup = PackBuilderSection.initAsOmniChild("ongoingListGroup");
    listGroup.addChild("ongoingList", {
      dbVarbs: {
        displayName: stringObj("Utilities"),
        totalOngoingSwitch: "monthly",
        itemValueSwitch: "labeledEquation",
        itemOngoingSwitch: "monthly",
      },
    });
    listGroup.addChild("ongoingList", {
      dbVarbs: {
        displayName: stringObj("CapEx"),
        totalOngoingSwitch: "yearly",
        itemValueSwitch: "labeledSpanOverCost",
        itemOngoingSwitch: "yearly",
      },
    });
    return listGroup.makeSectionPack();
  },
};
