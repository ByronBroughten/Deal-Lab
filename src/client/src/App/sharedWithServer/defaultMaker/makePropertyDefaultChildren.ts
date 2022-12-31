import { stringObj } from "../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export const defaultPropertyChildrenMakers = {
  upfrontCostListGroup(): SectionPack<"singleTimeListGroup"> {
    const listGroup = PackBuilderSection.initAsOmniChild("singleTimeListGroup");
    listGroup.addChild("singleTimeList", {
      dbVarbs: { displayName: stringObj("Repairs") },
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
