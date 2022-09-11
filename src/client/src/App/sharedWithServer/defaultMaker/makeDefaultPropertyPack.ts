import { stringObj } from "../SectionsMeta/baseSectionsUtils/baseValues/StringObj";
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

  property.addChild("ongoingCostList", {
    dbVarbs: {
      displayName: stringObj("Utilities"),
      totalOngoingSwitch: "monthly",
      defaultValueSwitch: "labeledEquation",
      defaultOngoingSwitch: "monthly",
    },
  });
  property.addChild("ongoingCostList", {
    dbVarbs: {
      displayName: stringObj("CapEx"),
      totalOngoingSwitch: "yearly",
      defaultValueSwitch: "labeledSpanOverCost",
      defaultOngoingSwitch: "yearly",
    },
  });
  property.addChild("upfrontCostList", {
    dbVarbs: { displayName: stringObj("Repairs") },
  });

  return property.makeSectionPack();
}
