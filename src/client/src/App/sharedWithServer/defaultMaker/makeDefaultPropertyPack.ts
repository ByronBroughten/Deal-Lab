import { stringObj } from "../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultPropertyPack(): SectionPack<"property"> {
  const property = PackBuilderSection.initAsOmniChild("property", {
    dbVarbs: {
      taxesOngoingSwitch: "yearly",
      homeInsOngoingSwitch: "yearly",
      expensesOngoingSwitch: "yearly",
      targetRentOngoingSwitch: "monthly",
      miscRevenueOngoingSwitch: "monthly",
      revenueOngoingSwitch: "monthly",
    },
  });

  property.addChild("upfrontRevenueListGroup");
  property.addChild("ongoingRevenueListGroup");

  const upfrontCostGroup = property.addAndGetChild("upfrontCostListGroup");
  upfrontCostGroup.addChild("singleTimeList", {
    dbVarbs: { displayName: stringObj("Repairs") },
  });
  const ongoingCostGroup = property.addAndGetChild("ongoingCostListGroup");
  ongoingCostGroup.addChild("ongoingList", {
    dbVarbs: {
      displayName: stringObj("Utilities"),
      totalOngoingSwitch: "monthly",
      defaultValueSwitch: "labeledEquation",
      defaultOngoingSwitch: "monthly",
    },
  });
  ongoingCostGroup.addChild("ongoingList", {
    dbVarbs: {
      displayName: stringObj("CapEx"),
      totalOngoingSwitch: "yearly",
      defaultValueSwitch: "labeledSpanOverCost",
      defaultOngoingSwitch: "yearly",
    },
  });
  return property.makeSectionPack();
}
